from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import ConversionResponse, FileStatus
from app.services.visio_parser import VisioParser
from app.services.xml_generator import XMLGenerator
from app.core.config import settings
from app.api.upload import file_storage
import os

router = APIRouter()

async def convert_file_background(file_id: str):
    """Background task to convert file"""
    try:
        file_info = file_storage[file_id]
        file_info["status"] = FileStatus.CONVERTING
        
        # Get file paths
        input_path = os.path.join(settings.UPLOAD_DIR, file_info["filename"])
        output_filename = f"{file_id}.xml"
        output_path = os.path.join(settings.OUTPUT_DIR, output_filename)
        
        # Create output directory
        os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
        
        # Parse Visio file
        parser = VisioParser()
        visio_data = parser.parse_file(input_path)
        
        # Generate XML
        xml_generator = XMLGenerator()
        xml_content = xml_generator.generate_xml(visio_data)
        
        # Save XML file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(xml_content)
        
        # Update file info
        file_info["status"] = FileStatus.COMPLETED
        file_info["converted_filename"] = output_filename
        
    except Exception as e:
        file_info["status"] = FileStatus.FAILED
        file_info["error_message"] = str(e)

@router.post("/convert/{file_id}")
async def convert_file(file_id: str, background_tasks: BackgroundTasks):
    """Convert uploaded Visio file to XML"""
    
    if file_id not in file_storage:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_info = file_storage[file_id]
    
    if file_info["status"] != FileStatus.UPLOADED:
        raise HTTPException(status_code=400, detail="File is not ready for conversion")
    
    # Start background conversion
    background_tasks.add_task(convert_file_background, file_id)
    
    return ConversionResponse(
        file_id=file_id,
        status=FileStatus.CONVERTING,
        message="Conversion started"
    )

@router.get("/convert/{file_id}/status")
async def get_conversion_status(file_id: str):
    """Get conversion status for a file"""
    
    if file_id not in file_storage:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_info = file_storage[file_id]
    
    response = ConversionResponse(
        file_id=file_id,
        status=file_info["status"],
        message=f"File is {file_info['status']}"
    )
    
    if file_info["status"] == FileStatus.COMPLETED:
        response.download_url = f"/api/download/{file_id}"
    elif file_info["status"] == FileStatus.FAILED:
        response.message = file_info.get("error_message", "Conversion failed")
    
    return response