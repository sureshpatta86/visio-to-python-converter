export interface FileInfo {
  id: string;
  filename: string;
  original_filename: string;
  status: 'uploaded' | 'converting' | 'completed' | 'failed';
  size: number;
  upload_time: string;
  converted_filename?: string;
  error_message?: string;
}

export interface ConversionResponse {
  file_id: string;
  status: 'uploaded' | 'converting' | 'completed' | 'failed';
  message: string;
  download_url?: string;
}

export interface FileListResponse {
  files: FileInfo[];
  total: number;
}

export interface UploadResponse {
  file_id: string;
  message: string;
}