import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../hooks';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    document.title = `@${username} - Profile`;
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/user/profile/${username}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        // Check if current user is following this user
        if (currentUser?.following?.includes(response.data.user._id)) {
          setFollowing(true);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setMessage({ text: 'User not found', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setFollowLoading(true);
    try {
      const response = await axios.post(`/api/user/follow/${user._id}`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setFollowing(!following);
        
        // Update current user's following list
        const updatedUser = {
          ...currentUser,
          following: following 
            ? currentUser.following.filter(id => id !== user._id)
            : [...(currentUser.following || []), user._id]
        };
        updateUser(updatedUser);
        
        setMessage({ 
          text: following ? 'Unfollowed successfully' : 'Followed successfully', 
          type: 'success' 
        });
        
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      setMessage({ text: 'Error updating follow status', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-x-black via-gray-900 to-x-black flex items-center justify-center">
        <div className="bg-x-dark-gray rounded-xl p-8 border border-x-border shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-x-blue mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-x-black via-gray-900 to-x-black flex items-center justify-center">
        <div className="bg-x-dark-gray rounded-xl p-8 border border-x-border shadow-lg text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">User Not Found</h3>
          <p className="text-x-text-gray mb-6">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-x-blue text-white rounded-xl hover:bg-x-blue-hover transition-all duration-300"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-x-black via-gray-900 to-x-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-x-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-x-blue/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-24">
        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border shadow-lg transition-all duration-300 ${
            message.type === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-300' 
              : 'bg-red-500/20 border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="bg-x-dark-gray/80 backdrop-blur-xl rounded-2xl border border-x-border p-8 shadow-2xl shadow-black/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Profile Image Section */}
            <div className="relative group">
              <div className="relative">
                <img 
                  src={user?.profileImg || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-x-border object-cover shadow-lg transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-x-blue/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{user?.fullName}</h1>
                  <p className="text-lg text-x-text-gray mb-1">@{user?.username}</p>
                  <p className="text-sm text-x-text-gray mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {user?.email}
                  </p>
                </div>

                {/* Follow Button */}
                {currentUser && currentUser._id !== user._id && (
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
                      following
                        ? 'bg-transparent text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/40'
                        : 'bg-gradient-to-r from-x-blue to-purple-600 text-white hover:from-purple-600 hover:to-x-blue'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {followLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        {following ? 'Unfollowing...' : 'Following...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {following ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Following
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Follow
                          </>
                        )}
                      </div>
                    )}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white bg-gradient-to-r from-x-blue to-purple-600 bg-clip-text text-transparent">
                    {user?.following?.length || 0}
                  </div>
                  <div className="text-sm text-x-text-gray">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {user?.followers?.length || 0}
                  </div>
                  <div className="text-sm text-x-text-gray">Followers</div>
                </div>
              </div>

              {/* Bio */}
              {user?.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Bio</h3>
                  <p className="text-x-text-gray leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Link */}
              {user?.link && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Link</h3>
                  <a 
                    href={user.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-x-blue hover:text-x-blue-hover transition-colors duration-200 break-all"
                  >
                    {user.link}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-transparent text-white border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
