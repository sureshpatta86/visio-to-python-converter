# Quick Start Guide

This guide will help you get the Visio to XML Converter application up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** (3.13+ recommended)
- **Node.js 16+** and npm
- **Git**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sureshpatta86/visio-to-python-converter.git
cd visio-to-python-converter
```

### 2. Run the Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

This script will:
- Create a Python virtual environment
- Install all backend dependencies
- Install all frontend dependencies
- Create necessary directories
- Make scripts executable

### 3. Start the Application

```bash
./start-app.sh
```

This will start both the backend and frontend servers.

## Access the Application

Once both services are running:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Using the Application

1. **Upload Files**: Drag and drop or click to select Visio files (.vsd or .vsdx)
2. **Monitor Progress**: Watch the conversion progress in the file list
3. **Download Results**: Click the download button when conversion is complete

## Stopping the Application

Press `Ctrl+C` in the terminal where you ran `start-app.sh` to stop both services.

## Troubleshooting

### Port Already in Use

```bash
# Kill processes on ports 3000 and 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Virtual Environment Issues

```bash
# Remove and recreate virtual environment
rm -rf .venv
./setup.sh
```

### Frontend Dependencies Issues

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..
```

## Development Commands

```bash
# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Run both with concurrently
npm run dev

# Build frontend for production
npm run build:frontend

# Run tests
npm run test:backend
npm run test:frontend
```

## Docker Support

```bash
# Start with Docker Compose
docker-compose up --build

# Stop Docker services
docker-compose down
```

## File Support

- **Supported Formats**: .vsd, .vsdx
- **Maximum File Size**: 1GB
- **Output Format**: Structured XML

---

For more detailed information, see the main [README.md](README.md) file.