import { api } from './api';
import { FileInfo } from '../types';

export const fileService = {
  uploadFile: async (file: File): Promise<{ file_id: string; message: string }> => {
    return api.uploadFile(file);
  },
  
  convertFile: async (fileId: string) => {
    return api.convertFile(fileId);
  },
  
  getFiles: async (): Promise<{ files: FileInfo[]; total: number }> => {
    return api.getFiles();
  },
  
  deleteFile: async (fileId: string) => {
    return api.deleteFile(fileId);
  },
  
  downloadFile: (fileId: string) => {
    api.downloadFile(fileId);
  },
  
  validateFile: (file: File): { valid: boolean; error?: string } => {
    const maxSize = 1000 * 1024 * 1024; // 1GB
    const allowedTypes = ['.vsd', '.vsdx'];
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
      };
    }
    
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(extension)) {
      return {
        valid: false,
        error: 'Invalid file type. Only .vsd and .vsdx files are allowed'
      };
    }
    
    return { valid: true };
  }
};