import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import Notifications from './components/Notifications';
import Welcome from './components/Welcome';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/me', { withCredentials: true });
      if (res.data?.success) {
        setUser(res.data.user);
        fetchUnreadNotifications();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications/unread', {
        withCredentials: true
      });
      if (response.data.success) {
        setUnreadNotifications(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    await fetchUnreadNotifications();
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      setUnreadNotifications(0);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-x-black via-gray-900 to-x-black flex items-center justify-center">
        <div className="bg-x-dark-gray rounded-xl p-8 border border-x-border shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-x-blue mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-x-black text-white">
        {/* Navbar - only show for authenticated users */}
        {user && (
          <Navbar 
            user={user} 
            onLogout={handleLogout}
            unreadNotifications={unreadNotifications}
          />
        )}
        
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
          <Route path="/user/:username" element={<ProtectedRoute user={user}><UserProfile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute user={user}><Notifications /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
