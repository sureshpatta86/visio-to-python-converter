from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # File upload settings
    MAX_FILE_SIZE: int = 1000 * 1024 * 1024  # 1000MB = 1GB in bytes
    UPLOAD_DIR: str = "uploads"
    OUTPUT_DIR: str = "outputs"
    
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Visio to XML Converter"
    
    class Config:
        env_file = ".env"

settings = Settings()