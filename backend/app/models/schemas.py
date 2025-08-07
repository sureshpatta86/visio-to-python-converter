from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class FileStatus(str, Enum):
    UPLOADED = "uploaded"
    CONVERTING = "converting"
    COMPLETED = "completed"
    FAILED = "failed"

class FileInfo(BaseModel):
    id: str
    filename: str
    original_filename: str
    status: FileStatus
    size: int
    upload_time: str
    converted_filename: Optional[str] = None
    error_message: Optional[str] = None

class ConversionResponse(BaseModel):
    file_id: str
    status: FileStatus
    message: str
    download_url: Optional[str] = None

class FileListResponse(BaseModel):
    files: List[FileInfo]
    total: int