import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  Snackbar,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Common/Header';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { FileUpload } from './components/FileUpload/FileUpload';
import { FileList } from './components/Dashboard/FileList';
import { fileService } from './services/fileService';
import { FileInfo } from './types';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUploaded = (fileId: string, filename: string) => {
    setSuccess(`File "${filename}" uploaded successfully!`);
    loadFiles();
  };

  const handleFileUpdate = (fileId: string, updates: Partial<FileInfo>) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, ...updates } : file
    ));
  };

  const handleFileRemove = async (fileId: string) => {
    try {
      await fileService.deleteFile(fileId);
      setFiles(prev => prev.filter(file => file.id !== fileId));
      setSuccess('File removed successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to remove file');
    }
  };

  const handleError = (message: string) => {
    setError(message);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  const loadFiles = async () => {
    try {
      const response = await fileService.getFiles();
      setFiles(response.files);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load files');
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                  Convert Visio Files to XML
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Upload your Microsoft Visio files (.vsd or .vsdx) and convert them to structured XML format.
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <FileUpload
                  onFileUploaded={handleFileUploaded}
                  onError={handleError}
                />
              </Box>

              {files.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <FileList
                    files={files}
                    onFileUpdate={handleFileUpdate}
                    onFileRemove={handleFileRemove}
                    onError={handleError}
                  />
                </Box>
              )}

              {/* Features Section */}
              <Box sx={{ mt: 6, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Features
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      🔄 Complete Conversion
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Preserves all shapes, connectors, text, and formatting from your Visio diagrams.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      📁 Multiple Formats
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supports both legacy .vsd and modern .vsdx file formats.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      ⚡ Fast Processing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quick conversion with real-time progress tracking and status updates.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Container>

            {/* Error Snackbar */}
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={handleCloseError}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>

            {/* Success Snackbar */}
            <Snackbar
              open={!!success}
              autoHideDuration={4000}
              onClose={handleCloseSuccess}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                {success}
              </Alert>
            </Snackbar>
          </Box>
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;