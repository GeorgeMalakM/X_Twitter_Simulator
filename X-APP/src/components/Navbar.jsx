import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import XLogo from '../assets/X_twitter.svg';

const Navbar = ({ user, onLogout, unreadNotifications = 0 }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Public navbar (no user)
  if (!user) {
    return (
      <div className="fixed top-0 left-0 w-full h-16 bg-black/80 backdrop-blur-xl border-b border-white/10 z-[9999] shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="relative">
              <img src={XLogo} alt="X Logo" className="w-10 h-10 drop-shadow-lg" />
              <div className="absolute inset-0 w-10 h-10 bg-x-blue/20 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link className="flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/5 backdrop-blur-sm rounded-full cursor-pointer transition-all duration-300 text-white font-medium hover:bg-white/10 hover:border-white/30 hover:scale-105" to="/login">
              <span>Login</span>
            </Link>
            <Link className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-x-blue to-blue-600 border-none rounded-full cursor-pointer transition-all duration-300 text-white font-semibold hover:from-blue-600 hover:to-x-blue hover:scale-105 shadow-lg shadow-x-blue/25" to="/signup">
              <span>Sign up</span>
            </Link>
          </nav>
        </div>
      </div>
    );
  }

  // Determine active tab based on current location
  const getActiveTab = () => {
    if (location.pathname === '/dashboard' || location.pathname === '/') return 'home';
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/notifications') return 'notifications';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-black/80 backdrop-blur-xl border-b border-white/10 z-[9999] shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        {/* X Logo */}
        <div className="flex items-center">
          <Link to="/dashboard" className="relative group">
            <img src={XLogo} alt="X Logo" className="w-10 h-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 w-10 h-10 bg-x-blue/20 rounded-full blur-xl animate-pulse"></div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          <Link 
            to="/dashboard"
            className={`flex items-center gap-3 px-6 py-3 border rounded-full cursor-pointer transition-all duration-300 font-medium group ${
              activeTab === 'home' 
                ? 'text-white border-x-blue/50 bg-x-blue/10 shadow-lg shadow-x-blue/20' 
                : 'text-gray-300 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105'
            }`}
          >
            <svg viewBox="0 0 24 24" className={`w-6 h-6 fill-current transition-transform duration-300 ${activeTab === 'home' ? 'scale-110' : 'group-hover:scale-110'}`}>
              <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"/>
            </svg>
            <span className="font-semibold">Home</span>
          </Link>
          
          <Link 
            to="/notifications"
            className={`flex items-center gap-3 px-6 py-3 border rounded-full cursor-pointer transition-all duration-300 font-medium group relative ${
              activeTab === 'notifications' 
                ? 'text-white border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/20' 
                : 'text-gray-300 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105'
            }`}
          >
            <div className="relative">
              <svg viewBox="0 0 24 24" className={`w-6 h-6 fill-current transition-transform duration-300 ${activeTab === 'notifications' ? 'scale-110' : 'group-hover:scale-110'}`}>
                <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2C8.027 2 4.692 4.836 4.132 8.667L2.086 17.5H21.916L19.993 9.042zM12 20.5c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/>
              </svg>
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-black shadow-lg animate-pulse">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
            </div>
            <span className="font-semibold">Notifications</span>
          </Link>
          
          <Link 
            to="/profile"
            className={`flex items-center gap-3 px-6 py-3 border rounded-full cursor-pointer transition-all duration-300 font-medium group ${
              activeTab === 'profile' 
                ? 'text-white border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/20' 
                : 'text-gray-300 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105'
            }`}
          >
            <svg viewBox="0 0 24 24" className={`w-6 h-6 fill-current transition-transform duration-300 ${activeTab === 'profile' ? 'scale-110' : 'group-hover:scale-110'}`}>
              <path d="M5.651 19h12.698c-.337-1.021-1.22-1.779-2.317-1.779H7.968c-1.097 0-1.98.758-2.317 1.779zm7.968-3.779c1.097 0 1.98-.758 2.317-1.779H7.968c-1.097 0-1.98.758-2.317 1.779h7.968zM12 2c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z"/>
            </svg>
            <span className="font-semibold">Profile</span>
          </Link>
        </nav>

        {/* User Menu */}
        <div className="relative">
          <div 
            className="flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 hover:bg-white/10 border border-white/10 hover:border-white/20 group"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-all duration-300">
              <img 
                src={user?.profileImg || 'https://via.placeholder.com/40'} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block">
              <p className="text-white font-semibold text-sm">{user?.fullName}</p>
              <p className="text-gray-400 text-xs">@{user?.username}</p>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-[slideDown_0.2s_ease-out] z-[10000]">
              <div className="p-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                  <svg className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar; 