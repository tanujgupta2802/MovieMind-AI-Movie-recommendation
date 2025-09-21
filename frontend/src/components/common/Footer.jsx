import React from "react";
import { Film, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">MovieMind</h2>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover your next favorite movie with AI-powered recommendations
              and intelligent sentiment analysis of reviews.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/search"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Search Movies
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">AI Recommendations</li>
              <li className="text-gray-400">Sentiment Analysis</li>
              <li className="text-gray-400">Movie Reviews</li>
              <li className="text-gray-400">Personal Favorites</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 MovieMind. Built with MERN Stack & AI.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Powered by TMDB API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
