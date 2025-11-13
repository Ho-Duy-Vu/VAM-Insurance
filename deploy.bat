@echo off
REM VAM Insurance Quick Deploy Script for Windows
REM Usage: deploy.bat [docker|local|build|test]

echo ================================
echo VAM Insurance Deployment Script
echo ================================
echo.

if "%1"=="" goto :help
if "%1"=="docker" goto :docker
if "%1"=="local" goto :local
if "%1"=="build" goto :build
if "%1"=="test" goto :test
goto :help

:docker
echo [Docker Deployment]
echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed
    exit /b 1
)

echo Stopping existing containers...
docker-compose down

echo Building and starting containers...
docker-compose up --build -d

echo.
echo Deployment successful!
echo Frontend: http://localhost
echo Backend: http://localhost:8000
goto :end

:local
echo [Local Development Setup]
echo.
echo Setting up Frontend...
cd Frontend
call npm install
if errorlevel 1 goto :error
cd ..

echo.
echo Setting up Backend...
cd Backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
if errorlevel 1 goto :error
cd ..

echo.
echo Setup complete!
echo.
echo To start:
echo   Frontend: cd Frontend ^&^& npm run dev
echo   Backend: cd Backend ^&^& venv\Scripts\activate ^&^& python main.py
goto :end

:build
echo [Building Project]
echo.
echo Building Frontend...
cd Frontend
call npm install
call npm run build
if errorlevel 1 goto :error
cd ..

echo.
echo Setting up Backend...
cd Backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
if errorlevel 1 goto :error
cd ..

echo.
echo Build complete!
goto :test

:test
echo.
echo [Testing Deployment]
if exist "Frontend\dist" (
    echo [OK] Frontend build exists
) else (
    echo [FAIL] Frontend build not found
)

if exist "Backend\requirements.txt" (
    echo [OK] Backend requirements found
) else (
    echo [FAIL] Backend requirements not found
)

if exist "Backend\venv" (
    echo [OK] Backend virtual environment exists
) else (
    echo [WARN] Backend virtual environment not found
)
goto :end

:help
echo Usage: deploy.bat [command]
echo.
echo Commands:
echo   docker  - Deploy using Docker Compose
echo   local   - Setup for local development
echo   build   - Build Frontend and Backend
echo   test    - Test deployment readiness
echo.
echo For cloud deployment (Vercel/Render), see DEPLOYMENT_GUIDE.md
goto :end

:error
echo.
echo ERROR: Deployment failed!
exit /b 1

:end
echo.
pause
