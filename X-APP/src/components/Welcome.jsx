import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import XLogo from '../assets/X_twitter.svg';

const Welcome = () => {
  useEffect(() => {
    document.title = 'Welcome to X-Twitter';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-x-black via-gray-900 to-x-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-x-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-x-blue/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <main className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <img src={XLogo} alt="X Logo" className="w-20 h-20 mr-6 drop-shadow-lg" />
              <div className="absolute inset-0 w-20 h-20 bg-x-blue/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h1 className="text-6xl font-bold text-white bg-gradient-to-r from-x-blue to-purple-600 bg-clip-text text-transparent">
              Welcome to X Twitter
            </h1>
          </div>
          <p className="text-2xl text-x-text-gray mb-12 leading-relaxed">
            Join the conversation. Share your thoughts, follow friends, and stay updated with the latest trends.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-gradient-to-r from-x-blue to-purple-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-x-blue/25"
            >
              Create account
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-transparent text-white border-2 border-white/20 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-300"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
