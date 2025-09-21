MovieMind - AI Movie Recommendation System
A full-stack web application that provides AI-powered movie recommendations based on user preferences and intelligent sentiment analysis.
🎬 Features

Smart Movie Search: Search movies from TMDB's extensive database
AI-Powered Recommendations: Get personalized movie suggestions based on your preferences
User Authentication: Secure login and registration system
Responsive Design: Optimized for desktop and mobile devices
Real-time API Integration: Live data from The Movie Database (TMDB)
Intelligent Filtering: Advanced search and filtering capabilities

🛠️ Tech Stack
Frontend:

React.js with Vite
Tailwind CSS for styling
Axios for API calls
React Router for navigation
Lucide React for icons

Backend:

Node.js & Express.js
MongoDB with Mongoose
JWT Authentication
CORS enabled
RESTful API architecture

APIs & Services:

TMDB (The Movie Database) API
MongoDB Atlas (Cloud Database)

🚀 Getting Started
Prerequisites

Node.js (v14 or higher)
MongoDB Atlas account
TMDB API key

Installation

Clone the repository

bash   git clone https://github.com/tanujgupta2802/MovieMind-AI-Movie-recommendation.git
   cd MovieMind-AI-Movie-recommendation

Backend Setup

bash   # Navigate to backend directory
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

bash   # Open new terminal and navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Create .env file with:
   VITE_API_URL=http://localhost:5000
   VITE_APP_APP_NAME=MovieMind
   
   # Start frontend development server
   npm run dev
