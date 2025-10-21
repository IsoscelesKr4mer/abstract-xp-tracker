# Production Environment Variables
# Copy this to .env in both frontend and backend directories

# Backend (.env)
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/abstract-xp-tracker
JWT_SECRET=your-super-secure-jwt-secret-key-here
FRONTEND_URL=https://your-domain.com
NODE_ENV=production

# Frontend (.env)
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_ENVIRONMENT=production
