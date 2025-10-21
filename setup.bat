@echo off
echo 🚀 Starting Abstract XP Tracker Development Environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
)
echo ✅ Backend dependencies installed

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo ✅ Frontend dependencies installed

REM Create .env file if it doesn't exist
cd ..\backend
if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ✅ .env file created. Please update it with your configuration.
)

echo.
echo 🎉 Setup complete! You can now start the development servers:
echo.
echo Backend (Command Prompt 1):
echo   cd backend ^&^& npm run dev
echo.
echo Frontend (Command Prompt 2):
echo   cd frontend ^&^& npm start
echo.
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔗 Backend API will be available at: http://localhost:5000
echo.
echo 📚 Next steps:
echo 1. Update backend/.env with your API keys
echo 2. Start both servers
echo 3. Open http://localhost:3000 in your browser
echo 4. Connect your wallet to start tracking XP!
echo.
pause

