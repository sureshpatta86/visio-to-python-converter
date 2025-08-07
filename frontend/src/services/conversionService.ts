import { api } from './api';
import { ConversionResponse } from '../types';

export const conversionService = {
  startConversion: async (fileId: string): Promise<ConversionResponse> => {
    return api.convertFile(fileId);
  },
  
  getStatus: async (fileId: string): Promise<ConversionResponse> => {
    return api.getConversionStatus(fileId);
  },
  
  pollStatus: async (
    fileId: string, 
    onUpdate: (status: ConversionResponse) => void,
    interval: number = 2000
  ): Promise<void> => {
    const poll = async () => {
      try {
        const status = await conversionService.getStatus(fileId);
        onUpdate(status);
        
        if (status.status === 'converting') {
          setTimeout(poll, interval);
        }
      } catch (error) {
        console.error('Polling error:', error);
        // Continue polling on error
        setTimeout(poll, interval);
      }
    };
    
    poll();
  }
};