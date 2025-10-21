@echo off
echo ========================================
echo   MongoDB Atlas Setup Helper
echo ========================================
echo.

echo Step 1: Create .env files from examples...
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env"
    echo ✅ Created backend/.env
) else (
    echo ⚠️  backend/.env already exists
)

if not exist "frontend\.env" (
    copy "frontend\env.example" "frontend\.env"
    echo ✅ Created frontend/.env
) else (
    echo ⚠️  frontend/.env already exists
)

echo.
echo Step 2: Next steps:
echo.
echo 1. Go to MongoDB Atlas: https://www.mongodb.com/atlas
echo 2. Create a free cluster (M0 Sandbox)
echo 3. Get your connection string
echo 4. Edit backend/.env and replace MONGODB_URI with your connection string
echo 5. Edit backend/.env and set a secure JWT_SECRET
echo.
echo Example MONGODB_URI:
echo mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/abstract-xp-tracker?retryWrites=true&w=majority
echo.
echo Press any key to open the files for editing...
pause >nul

echo.
echo Opening backend/.env for editing...
notepad "backend\.env" 2>nul || echo Please edit backend/.env manually

echo.
echo Opening frontend/.env for editing...
notepad "frontend\.env" 2>nul || echo Please edit frontend/.env manually

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next: Start your servers with:
echo   cd backend && npm run dev
echo   cd frontend && npm start
echo.
pause
