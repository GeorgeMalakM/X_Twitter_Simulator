import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import XLogo from '../assets/X_twitter.svg';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    document.title = 'Log in';
  }, []);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/login', {
        username: formData.username,
        password: formData.password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setMessage('Login successful! Redirecting...');
        // Update user state in App.jsx
        if (onLogin && response.data.user) {
          onLogin(response.data.user);
        }
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || 'Login failed');
      } else {
        setMessage('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-x-black via-gray-900 to-x-black p-5 box-border relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-x-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-x-blue/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="bg-x-dark-gray/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 border border-white/10 p-10 w-full max-w-md animate-[slideUp_0.6s_ease-out] flex flex-col items-center justify-center relative z-10">
        <div className="text-center mb-8 w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <img src={XLogo} alt="X Logo" className="w-16 h-16 mr-4 drop-shadow-lg" />
              <div className="absolute inset-0 w-16 h-16 bg-x-blue/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h1 className="text-white text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Welcome Back</h1>
          </div>
          <p className="text-gray-400 text-lg font-medium">Sign in to your account</p>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl mb-6 font-medium text-center w-full backdrop-blur-sm border ${
            message.includes('successful') 
              ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-lg shadow-green-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-lg shadow-red-500/20'
          } animate-[fadeIn_0.3s_ease-out]`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full items-center">
          <div className="flex flex-col gap-3 w-full">
            <label htmlFor="username" className="font-semibold text-sm text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-4 bg-x-light-gray/50 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.username 
                    ? 'border-red-500/50 bg-red-500/10 focus:ring-red-500/20' 
                    : 'border-gray-600/50 focus:border-x-blue/50 focus:ring-x-blue/20 hover:border-gray-500/50'
                }`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {errors.username && (
              <p className="text-red-400 text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.username}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label htmlFor="password" className="font-semibold text-sm text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-4 bg-x-light-gray/50 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 pr-12 ${
                  errors.password 
                    ? 'border-red-500/50 bg-red-500/10 focus:ring-red-500/20' 
                    : 'border-gray-600/50 focus:border-x-blue/50 focus:ring-x-blue/20 hover:border-gray-500/50'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
              {errors.password && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-x-blue to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-x-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-x-blue/25 hover:shadow-xl hover:shadow-x-blue/30 hover:scale-[1.02] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sign In
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <a href="/signup" className="text-x-blue hover:text-x-blue-hover font-semibold transition-colors duration-200">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 