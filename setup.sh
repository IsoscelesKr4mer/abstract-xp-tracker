#!/bin/bash

# Abstract XP Tracker - Development Startup Script
echo "🚀 Starting Abstract XP Tracker Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
fi
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
fi
echo "✅ Frontend dependencies installed"

# Create .env file if it doesn't exist
cd ../backend
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

echo ""
echo "🎉 Setup complete! You can now start the development servers:"
echo ""
echo "Backend (Terminal 1):"
echo "  cd backend && npm run dev"
echo ""
echo "Frontend (Terminal 2):"
echo "  cd frontend && npm start"
echo ""
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔗 Backend API will be available at: http://localhost:5000"
echo ""
echo "📚 Next steps:"
echo "1. Update backend/.env with your API keys"
echo "2. Start both servers"
echo "3. Open http://localhost:3000 in your browser"
echo "4. Connect your wallet to start tracking XP!"

