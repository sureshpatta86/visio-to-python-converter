#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "Setting up Visio to XML Converter development environment..."
print_status "=========================================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check Python version
print_status "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
print_success "Found Python $PYTHON_VERSION"

# Check Node.js version
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Found Node.js $NODE_VERSION"

# Create Python virtual environment
print_status "Creating Python virtual environment..."
if [ -d ".venv" ]; then
    print_warning "Virtual environment already exists. Skipping creation."
else
    python3 -m venv .venv
    print_success "Virtual environment created at .venv/"
fi

# Activate virtual environment and install backend dependencies
print_status "Installing backend dependencies..."
source .venv/bin/activate
cd backend
pip install --upgrade pip
pip install -r requirements.txt
cd ..
print_success "Backend dependencies installed"

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js with npm."
    exit 1
fi

npm install
cd ..
print_success "Frontend dependencies installed"

# Install root dependencies
print_status "Installing root project dependencies..."
npm install
print_success "Root dependencies installed"

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs
touch logs/backend.log
touch logs/frontend.log
print_success "Logs directory created"

# Make scripts executable
print_status "Making scripts executable..."
chmod +x start-app.sh
chmod +x setup.sh
print_success "Scripts made executable"

# Setup complete
print_success "=========================================================="
print_success "🎉 Setup completed successfully!"
print_success "=========================================================="
print_status "Next steps:"
print_status "1. Run './start-app.sh' to start both frontend and backend"
print_status "2. Open http://localhost:3000 in your browser"
print_status "3. Backend API will be available at http://localhost:8000"
print_success "=========================================================="