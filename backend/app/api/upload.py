from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.models.schemas import FileInfo, FileStatus
from app.utils.validators import validate_file
import os
import uuid
from datetime import datetime
import json

router = APIRouter()

# Simple in-memory storage for demo (use database in production)
file_storage = {}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a Visio file for conversion"""
    
    # Validate file
    validation_result = validate_file(file)
    if not validation_result["valid"]:
        raise HTTPException(status_code=400, detail=validation_result["error"])
    
    # Generate unique file ID
    file_id = str(uuid.uuid4())
    
    # Create upload directory if it doesn't exist
    upload_dir = settings.UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_dir, f"{file_id}.{file.filename.split('.')[-1]}")
    
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Store file info
        file_info = FileInfo(
            id=file_id,
            filename=f"{file_id}.{file.filename.split('.')[-1]}",
            original_filename=file.filename,
            status=FileStatus.UPLOADED,
            size=len(content),
            upload_time=datetime.now().isoformat()
        )
        
        file_storage[file_id] = file_info.dict()
        
        return JSONResponse(
            status_code=200,
            content={"file_id": file_id, "message": "File uploaded successfully"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@router.get("/files")
async def list_files():
    """Get list of all uploaded files"""
    files = list(file_storage.values())
    return {"files": files, "total": len(files)}

@router.delete("/files/{file_id}")
async def delete_file(file_id: str):
    """Delete a file and its data"""
    if file_id not in file_storage:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete physical file
    file_info = file_storage[file_id]
    file_path = os.path.join(settings.UPLOAD_DIR, file_info["filename"])
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Delete converted file if exists
    if file_info.get("converted_filename"):
        converted_path = os.path.join(settings.OUTPUT_DIR, file_info["converted_filename"])
        if os.path.exists(converted_path):
            os.remove(converted_path)
    
    # Remove from storage
    del file_storage[file_id]
    
    return {"message": "File deleted successfully"}