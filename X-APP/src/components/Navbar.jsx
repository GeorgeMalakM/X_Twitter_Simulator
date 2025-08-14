import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import XLogo from '../assets/X_twitter.svg';

const Navbar = ({ user, onLogout, unreadNotifications = 0 }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

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

  // Click outside handler for search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Search functionality
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearching(true);
    try {
      const response = await axios.get(`/api/user/search?q=${encodeURIComponent(query)}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Filter out the current user from search results
        const filteredResults = response.data.users.filter(u => u._id !== user._id);
        setSearchResults(filteredResults);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleUserClick = (userId, username) => {
    setShowSearchResults(false);
    setSearchQuery('');
    // Navigate to user profile
    navigate(`/user/${username}`);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2 && searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

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

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={handleSearchFocus}
              className="w-full px-4 py-2 pl-10 bg-x-light-gray/50 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-x-blue/50 focus:ring-2 focus:ring-x-blue/20 transition-all duration-300"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-x-blue"></div>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[10000] max-h-80 overflow-y-auto">
              <div className="p-2">
                {searchResults.map((result) => (
                  <div
                    key={result._id}
                    onClick={() => handleUserClick(result._id, result.username)}
                    className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all duration-200 group"
                  >
                    <img
                      src={result.profileImg || 'https://via.placeholder.com/40'}
                      alt={result.fullName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20 group-hover:border-x-blue/50 transition-colors duration-200"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-white group-hover:text-x-blue transition-colors duration-200">
                        {result.fullName}
                      </div>
                      <div className="text-sm text-gray-400">@{result.username}</div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5 text-x-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {showSearchResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !searching && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[10000]">
              <div className="p-4 text-center">
                <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No users found</p>
              </div>
            </div>
          )}
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