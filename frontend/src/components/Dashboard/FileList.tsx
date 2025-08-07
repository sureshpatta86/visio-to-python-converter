import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  LinearProgress,
  Box,
  Divider
} from '@mui/material';
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { FileInfo } from '../../types';
import { fileService } from '../../services/fileService';
import { conversionService } from '../../services/conversionService';

interface FileListProps {
  files: FileInfo[];
  onFileUpdate: (fileId: string, updates: Partial<FileInfo>) => void;
  onFileRemove: (fileId: string) => void;
  onError: (message: string) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onFileUpdate,
  onFileRemove,
  onError
}) => {
  useEffect(() => {
    // Poll for status updates on converting files
    const convertingFiles = files.filter(file => file.status === 'converting');
    
    convertingFiles.forEach(file => {
      conversionService.pollStatus(file.id, (status) => {
        onFileUpdate(file.id, { 
          status: status.status as any,
          converted_filename: status.download_url ? `${file.id}.xml` : undefined,
          error_message: status.status === 'failed' ? status.message : undefined
        });
      });
    });
  }, [files, onFileUpdate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'info';
      case 'converting': return 'warning';
      case 'completed': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <CloudUploadIcon fontSize="small" />;
      case 'converting': return <ScheduleIcon fontSize="small" />;
      case 'completed': return <CheckCircleIcon fontSize="small" />;
      case 'failed': return <ErrorIcon fontSize="small" />;
      default: return null;
    }
  };

  const handleDownload = (file: FileInfo) => {
    if (file.status === 'completed') {
      fileService.downloadFile(file.id);
    }
  };

  const handleRetry = async (file: FileInfo) => {
    try {
      onFileUpdate(file.id, { status: 'converting', error_message: undefined });
      await conversionService.startConversion(file.id);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to retry conversion');
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          File Queue ({files.length})
        </Typography>
        
        <List>
          {files.map((file, index) => (
            <React.Fragment key={file.id}>
              <ListItem
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: 'background.paper'
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" noWrap>
                        {file.original_filename}
                      </Typography>
                      <Chip
                        size="small"
                        label={file.status.toUpperCase()}
                        color={getStatusColor(file.status) as any}
                        icon={getStatusIcon(file.status)}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Size: {formatFileSize(file.size)} • Uploaded: {new Date(file.upload_time).toLocaleString()}
                      </Typography>
                      
                      {file.status === 'converting' && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" gutterBottom>
                            Converting...
                          </Typography>
                          <LinearProgress />
                        </Box>
                      )}
                      
                      {file.status === 'failed' && file.error_message && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                          Error: {file.error_message}
                        </Typography>
                      )}
                      
                      {file.status === 'completed' && (
                        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                          ✓ Conversion completed successfully
                        </Typography>
                      )}
                    </Box>
                  }
                />
                
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {file.status === 'completed' && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(file)}
                      >
                        Download XML
                      </Button>
                    )}
                    
                    {file.status === 'failed' && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={() => handleRetry(file)}
                      >
                        Retry
                      </Button>
                    )}
                    
                    <IconButton
                      size="small"
                      onClick={() => onFileRemove(file.id)}
                      disabled={file.status === 'converting'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              
              {index < files.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};