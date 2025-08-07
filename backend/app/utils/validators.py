from fastapi import UploadFile
from app.core.config import settings

def validate_file(file: UploadFile) -> dict:
    """Validate uploaded file"""
    
    # Check file size
    if hasattr(file, 'size') and file.size > settings.MAX_FILE_SIZE:
        return {
            "valid": False,
            "error": f"File size too large. Maximum size is {settings.MAX_FILE_SIZE / (1024*1024):.0f}MB"
        }
    
    # Check file extension
    allowed_extensions = ['.vsd', '.vsdx']
    file_extension = f".{file.filename.split('.')[-1].lower()}"
    
    if file_extension not in allowed_extensions:
        return {
            "valid": False,
            "error": "Invalid file type. Only .vsd and .vsdx files are allowed"
        }
    
    return {"valid": True}