import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { fileService } from '../../services/fileService';
import { conversionService } from '../../services/conversionService';

interface FileUploadProps {
  onFileUploaded: (fileId: string, filename: string) => void;
  onError: (message: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Validate file
    const validation = fileService.validateFile(file);
    if (!validation.valid) {
      onError(validation.error || 'Invalid file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fileService.uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Start conversion automatically
      await conversionService.startConversion(response.file_id);
      
      onFileUploaded(response.file_id, file.name);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Visio File
        </Typography>
        
        <Box
          sx={{
            border: 2,
            borderColor: isDragging ? 'primary.main' : 'grey.300',
            borderStyle: 'dashed',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: isDragging ? 'action.hover' : 'transparent',
            '&:hover': {
              backgroundColor: 'action.hover',
              borderColor: 'primary.main'
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <DescriptionIcon 
            sx={{ 
              fontSize: 48, 
              color: 'primary.main', 
              mb: 2 
            }} 
          />
          
          <Typography variant="h6" gutterBottom>
            Drag & Drop or Click to Upload
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Support for .vsd and .vsdx files up to 1GB
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Select File'}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".vsd,.vsdx"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </Box>
        
        {isUploading && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Uploading file... {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}
        
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Supported formats:</strong> Microsoft Visio (.vsd, .vsdx) files up to 1GB
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};