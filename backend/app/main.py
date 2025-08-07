from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import upload, convert, download
from app.core.config import settings

app = FastAPI(
    title="Visio to XML Converter API",
    description="Convert Microsoft Visio files to XML format",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(convert.router, prefix="/api", tags=["convert"])
app.include_router(download.router, prefix="/api", tags=["download"])

@app.get("/")
async def root():
    return {"message": "Visio to XML Converter API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}