from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.core.config import settings
from app.api.upload import file_storage
import os

router = APIRouter()

@router.get("/download/{file_id}")
async def download_file(file_id: str):
    """Download converted XML file"""
    
    if file_id not in file_storage:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_info = file_storage[file_id]
    
    if file_info["status"] != "completed":
        raise HTTPException(status_code=400, detail="File conversion not completed")
    
    if not file_info.get("converted_filename"):
        raise HTTPException(status_code=404, detail="Converted file not found")
    
    file_path = os.path.join(settings.OUTPUT_DIR, file_info["converted_filename"])
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Converted file does not exist")
    
    return FileResponse(
        path=file_path,
        filename=f"{file_info['original_filename']}.xml",
        media_type="application/xml"
    )