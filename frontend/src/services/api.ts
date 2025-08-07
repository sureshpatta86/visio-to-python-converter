const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    
    return response.json();
  },
  
  convertFile: async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/convert/${fileId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Conversion failed');
    }
    
    return response.json();
  },
  
  getConversionStatus: async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/convert/${fileId}/status`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get status');
    }
    
    return response.json();
  },
  
  getFiles: async () => {
    const response = await fetch(`${API_BASE_URL}/api/files`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get files');
    }
    
    return response.json();
  },
  
  deleteFile: async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete file');
    }
    
    return response.json();
  },
  
  downloadFile: (fileId: string) => {
    window.open(`${API_BASE_URL}/api/download/${fileId}`, '_blank');
  }
};