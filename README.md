# Visio to XML Converter

A modern web application that converts Microsoft Visio files (.vsd/.vsdx) to structured XML format with real-time progress tracking and download functionality.

## 🌟 Features

- **📁 File Upload**: Drag & drop interface supporting both legacy .vsd and modern .vsdx formats
- **📏 Large File Support**: Process files up to 1GB in size
- **⚡ Real-time Progress**: Live conversion progress tracking with status updates
- **📊 File Management**: Queue management with upload, convert, and download workflow
- **🎨 Modern UI**: Clean, responsive Material-UI interface
- **🔧 Error Handling**: Comprehensive error reporting and validation
- **🚀 Fast Processing**: Optimized conversion pipeline with progress indicators

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) for modern, responsive design
- **State Management**: React Query for API state management
- **Build Tool**: Create React App with webpack
- **Port**: 3000

### Backend (FastAPI + Python)
- **Framework**: FastAPI for high-performance async API
- **Language**: Python 3.13+ with type hints
- **Server**: Uvicorn ASGI server
- **File Processing**: Custom Visio parser and XML generator
- **Port**: 8000

## 🚀 Quick Start

### Prerequisites
- Python 3.13+ 
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sureshpatta86/visio-to-python-converter.git
   cd visio-to-python-converter
   ```

2. **Run setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start the application**
   ```bash
   chmod +x start-app.sh
   ./start-app.sh
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📖 Usage

1. **Upload Files**: Drag and drop or click to select Visio files (.vsd/.vsdx)
2. **Monitor Progress**: Watch real-time conversion progress in the file list
3. **Download Results**: Click download button when conversion completes
4. **Manage Queue**: Remove files or retry failed conversions

## 🛠️ Development

### Project Structure
```
visio-to-python-converter/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API and service layers
│   │   └── types/          # TypeScript definitions
│   ├── package.json
│   └── Dockerfile
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── requirements.txt
│   └── Dockerfile
├── logs/                   # Application logs
├── start-app.sh           # Application startup script
├── setup.sh              # Environment setup script
└── docker-compose.yml    # Docker configuration
```

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### API Endpoints

- `POST /api/upload` - Upload Visio files
- `POST /api/convert/{file_id}` - Convert uploaded file to XML
- `GET /api/download/{file_id}` - Download converted XML
- `GET /api/files` - List all files with status
- `DELETE /api/files/{file_id}` - Remove file

## 🐳 Docker Support

### Using Docker Compose
```bash
docker-compose up --build
```

### Individual Services
```bash
# Backend
cd backend
docker build -t visio-converter-backend .
docker run -p 8000:8000 visio-converter-backend

# Frontend
cd frontend
docker build -t visio-converter-frontend .
docker run -p 3000:3000 visio-converter-frontend
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Configuration

### Environment Variables

#### Backend (.env)
```env
MAX_FILE_SIZE=1000000000  # 1GB in bytes
UPLOAD_DIR=uploads
OUTPUT_DIR=outputs
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MAX_FILE_SIZE=1000000000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues and Support

- **Bug Reports**: [GitHub Issues](https://github.com/sureshpatta86/visio-to-python-converter/issues)
- **Feature Requests**: [GitHub Issues](https://github.com/sureshpatta86/visio-to-python-converter/issues)

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes on ports 3000 and 8000
   lsof -ti:3000 | xargs kill -9
   lsof -ti:8000 | xargs kill -9
   ```

2. **Python Virtual Environment Issues**
   ```bash
   # Recreate virtual environment
   rm -rf .venv
   python -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```

3. **Node.js Dependencies Issues**
   ```bash
   # Clear npm cache and reinstall
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📊 Performance

- **File Size Limit**: Up to 1GB
- **Supported Formats**: .vsd, .vsdx
- **Concurrent Uploads**: Multiple files supported
- **Processing Time**: Varies by file size and complexity

---

**Made with ❤️ by [Suresh Patta](https://github.com/sureshpatta86)**