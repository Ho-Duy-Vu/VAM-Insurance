#!/bin/bash

# VAM Insurance Quick Deploy Script
# Usage: ./deploy.sh [vercel|render|docker|vps]

set -e

echo "🚀 VAM Insurance Deployment Script"
echo "=================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed${NC}"
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}Python3 is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All dependencies installed${NC}"
}

deploy_local() {
    echo -e "${YELLOW}Deploying locally with Docker...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed${NC}"
        exit 1
    fi
    
    docker-compose down
    docker-compose up --build -d
    
    echo -e "${GREEN}✓ Deployed successfully!${NC}"
    echo "Frontend: http://localhost"
    echo "Backend: http://localhost:8000"
}

build_frontend() {
    echo -e "${YELLOW}Building Frontend...${NC}"
    cd Frontend
    npm install
    npm run build
    cd ..
    echo -e "${GREEN}✓ Frontend built successfully${NC}"
}

build_backend() {
    echo -e "${YELLOW}Setting up Backend...${NC}"
    cd Backend
    python3 -m venv venv
    source venv/bin/activate || . venv/Scripts/activate
    pip install -r requirements.txt
    cd ..
    echo -e "${GREEN}✓ Backend setup complete${NC}"
}

test_deployment() {
    echo -e "${YELLOW}Testing deployment...${NC}"
    
    # Test Frontend build
    if [ -d "Frontend/dist" ]; then
        echo -e "${GREEN}✓ Frontend build exists${NC}"
    else
        echo -e "${RED}✗ Frontend build not found${NC}"
    fi
    
    # Test Backend
    if [ -f "Backend/requirements.txt" ]; then
        echo -e "${GREEN}✓ Backend requirements found${NC}"
    else
        echo -e "${RED}✗ Backend requirements not found${NC}"
    fi
}

# Main deployment logic
case "$1" in
    "docker")
        echo "🐳 Docker Deployment"
        check_dependencies
        deploy_local
        ;;
    
    "local")
        echo "💻 Local Development Setup"
        check_dependencies
        build_frontend
        build_backend
        echo -e "${GREEN}✓ Setup complete!${NC}"
        echo "Start Frontend: cd Frontend && npm run dev"
        echo "Start Backend: cd Backend && source venv/bin/activate && python main.py"
        ;;
    
    "build")
        echo "🔨 Building project..."
        build_frontend
        build_backend
        test_deployment
        ;;
    
    "test")
        echo "🧪 Testing deployment..."
        test_deployment
        ;;
    
    *)
        echo "Usage: $0 {docker|local|build|test}"
        echo ""
        echo "Commands:"
        echo "  docker  - Deploy using Docker Compose"
        echo "  local   - Setup for local development"
        echo "  build   - Build Frontend and Backend"
        echo "  test    - Test deployment readiness"
        echo ""
        echo "For cloud deployment (Vercel/Render), see DEPLOYMENT_GUIDE.md"
        exit 1
        ;;
esac
