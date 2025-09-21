MovieMind - AI-powered Movie Recommendation System
A full-stack web application that provides AI-powered movie recommendations based on user preferences and intelligent sentiment analysis.

:🎬 Features
1. Smart Movie Search: Search movies from TMDB's extensive database
2. AI-Powered Recommendations: Get personalized movie suggestions based on your preferences
3. User Authentication: Secure login and registration system
4. Responsive Design: Optimized for desktop and mobile devices
5. Real-time API Integration: Live data from The Movie Database (TMDB)
Intelligent Filtering: Advanced search and filtering capabilities

🛠️ Tech Stack
Frontend:
1. React.js with Vite
2. Tailwind CSS for styling
3. Axios for API calls
4. React Router for navigation
5. Lucide React for icons

Backend:
1. Node.js & Express.js
2. MongoDB with Mongoose
3. JWT Authentication
4. CORS enabled
5. RESTful API architecture

APIs & Services:
TMDB (The Movie Database) API
MongoDB Atlas (Cloud Database)

🚀 Getting Started
Prerequisites

Node.js (v14 or higher)
MongoDB Atlas account
TMDB API key

Installation
1. Clone the repository

2. git clone https://github.com/tanujgupta2802/MovieMind-AI-Movie-recommendation.git
   cd MovieMind-AI-Movie-recommendation

Backend Setup
# Navigate to backend directory
   cd backend
   
   # Install dependencies
   npm install
   
   # Create .env file with following variables:
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   TMDB_API_KEY=your_tmdb_api_key
   FRONTEND_URL=http://localhost:3000
   
   # Start backend server
   npm start

Frontend Setup
# Open new terminal and navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Create .env file with:
   VITE_API_URL=http://localhost:5000
   VITE_APP_APP_NAME=MovieMind
   
   # Start frontend development server
   npm run dev
