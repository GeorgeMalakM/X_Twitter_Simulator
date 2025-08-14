import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from './Post';
import axios from 'axios';
import { 
  useUser, 
  useAuth, 
  useNotifications, 
  useFollow, 
  usePostManagement
} from '../hooks';

const Dashboard = () => {
  const { user, loading, updateUser } = useUser();
  const { logout } = useAuth();
  const { unreadNotifications } = useNotifications();
  const { handleFollowUpdate } = useFollow(user, updateUser);
  const { handlePostCreated, handlePostDeleted } = usePostManagement();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  useEffect(() => {
    if (user) {
      fetchSuggestedUsers();
    }
  }, [user]);

  const fetchSuggestedUsers = async () => {
    if (!user) return;
    
    setLoadingSuggestions(true);
    try {
      const response = await axios.get('/api/user/suggestions', {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Filter out users that the current user is already following
        const filteredSuggestions = response.data.users.filter(
          suggestedUser => !user.following?.includes(suggestedUser._id)
        );
        setSuggestedUsers(filteredSuggestions.slice(0, 5)); // Show max 5 suggestions
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleFollowUser = async (userId) => {
    try {
      const response = await axios.post(`/api/user/follow/${userId}`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Update local state
        const updatedUser = {
          ...user,
          following: [...(user.following || []), userId]
        };
        updateUser(updatedUser);
        
        // Remove the followed user from suggestions
        setSuggestedUsers(prev => prev.filter(u => u._id !== userId));
        
        // Trigger follow update callback
        handleFollowUpdate();
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/user/${username}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-x-black via-gray-900 to-x-black flex items-center justify-center">
        <div className="bg-x-dark-gray rounded-xl p-8 border border-x-border shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-x-blue mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-x-black via-gray-900 to-x-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-x-blue/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-x-blue/3 to-purple-500/3 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Posts */}
          <div className="lg:col-span-3">
            <Post 
              user={user}
              onPostCreated={handlePostCreated}
              onPostDeleted={handlePostDeleted}
              onFollowUpdate={handleFollowUpdate}
            />
          </div>

          {/* Sidebar - People You May Know */}
          <div className="lg:col-span-1">
            <div className="bg-x-dark-gray/80 backdrop-blur-xl rounded-2xl border border-x-border p-6 shadow-2xl shadow-black/20 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-x-blue to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">People You May Know</h2>
                  <p className="text-sm text-x-text-gray">Discover new connections</p>
                </div>
              </div>

              {loadingSuggestions ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-x-light-gray/30 rounded-xl animate-pulse">
                      <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-600 rounded mb-2"></div>
                        <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                      </div>
                      <div className="w-16 h-8 bg-gray-600 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : suggestedUsers.length > 0 ? (
                <div className="space-y-4">
                  {suggestedUsers.map((suggestedUser) => (
                    <div key={suggestedUser._id} className="flex items-center gap-3 p-3 bg-x-light-gray/30 rounded-xl hover:bg-x-light-gray/50 transition-all duration-300 group">
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => handleUserClick(suggestedUser.username)}
                      >
                        <img
                          src={suggestedUser.profileImg || 'https://via.placeholder.com/40'}
                          alt={suggestedUser.fullName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-x-border group-hover:border-x-blue/50 transition-colors duration-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm truncate group-hover:text-x-blue transition-colors duration-200">
                            {suggestedUser.fullName}
                          </div>
                          <div className="text-xs text-x-text-gray truncate">
                            @{suggestedUser.username}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowUser(suggestedUser._id);
                        }}
                        className="px-3 py-1.5 bg-x-blue text-white text-xs font-semibold rounded-full hover:bg-x-blue-hover transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-x-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-x-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No Suggestions</h3>
                  <p className="text-x-text-gray text-sm">You're following everyone we can suggest!</p>
                </div>
              )}

              {suggestedUsers.length > 0 && (
                <div className="mt-6 pt-4 border-t border-x-border">
                  <button
                    onClick={fetchSuggestedUsers}
                    className="w-full px-4 py-2 bg-transparent text-x-blue border border-x-blue/30 rounded-xl hover:bg-x-blue/10 transition-all duration-300 text-sm font-medium"
                  >
                    Refresh Suggestions
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 