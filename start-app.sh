#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored status messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to cleanup processes on exit
cleanup() {
    print_status "Shutting down applications..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_status "Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "Frontend stopped"
    fi
    # Kill any remaining processes
    pkill -f "uvicorn.*app.main:app" 2>/dev/null || true
    pkill -f "react-scripts start" 2>/dev/null || true
    print_success "Cleanup completed"
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

print_status "Starting Visio to XML Converter Application..."
print_status "=========================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Kill any existing processes on the ports
print_status "Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Check if Python virtual environment exists
if [ ! -d ".venv" ]; then
    print_error "Python virtual environment not found. Please run setup first."
    exit 1
fi

# Get Python executable path
PYTHON_PATH="$(pwd)/.venv/bin/python"
if [ ! -f "$PYTHON_PATH" ]; then
    print_error "Python executable not found in virtual environment"
    exit 1
fi

# Check if backend dependencies are installed
if [ ! -f "backend/requirements.txt" ]; then
    print_error "Backend requirements.txt not found"
    exit 1
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    print_warning "Frontend dependencies not found. Installing..."
    cd frontend
    npm install
    cd ..
    print_success "Frontend dependencies installed"
fi

print_status "Starting backend server..."
# Start backend in background
cd backend
$PYTHON_PATH -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if kill -0 $BACKEND_PID 2>/dev/null; then
    print_success "Backend started successfully (PID: $BACKEND_PID)"
    print_status "Backend API: http://localhost:8000"
    print_status "API Documentation: http://localhost:8000/docs"
else
    print_error "Failed to start backend server"
    print_error "Check logs/backend.log for details"
    exit 1
fi

print_status "Starting frontend development server..."
# Start frontend in background
cd frontend
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 10

# Check if frontend started successfully
if kill -0 $FRONTEND_PID 2>/dev/null; then
    print_success "Frontend started successfully (PID: $FRONTEND_PID)"
    print_status "Frontend App: http://localhost:3000"
else
    print_error "Failed to start frontend server"
    print_error "Check logs/frontend.log for details"
    exit 1
fi

print_success "=========================================="
print_success "🚀 Application started successfully!"
print_success "=========================================="
print_status "Frontend:     http://localhost:3000"
print_status "Backend API:  http://localhost:8000"
print_status "API Docs:     http://localhost:8000/docs"
print_success "=========================================="
print_status "Press Ctrl+C to stop both services"

# Wait for user to stop the application
while true; do
    sleep 1
    # Check if processes are still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend process died unexpectedly"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend process died unexpectedly"
        break
    fi
done