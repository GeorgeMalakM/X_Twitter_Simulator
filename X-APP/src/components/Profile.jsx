import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../hooks';

const Profile = () => {
  const { user, updateUser } = useUser();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    document.title = 'Profile';
  }, []);

  useEffect(() => {
    if (user?.following) {
      fetchFollowingUsers();
    }
  }, [user?.following]);

  const fetchFollowingUsers = async () => {
    if (!user?.following || user.following.length === 0) {
      setFollowingUsers([]);
      return;
    }

    try {
      const response = await axios.get('/api/user/users', {
        withCredentials: true
      });
      
      if (response.data.success) {
        const followingUserDetails = response.data.users.filter(userDetail => 
          user.following.includes(userDetail._id)
        );
        setFollowingUsers(followingUserDetails);
      }
    } catch (error) {
      console.error('Error fetching following users:', error);
    }
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfileImage = async () => {
    if (!profileImage) {
      setMessage({ text: 'Please select an image first', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', profileImage);

      const response = await axios.put('/api/user/profile-picture', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Update local user state with new profile picture
        const updatedUser = {
          ...user,
          profileImg: response.data.profilePicture
        };
        updateUser(updatedUser);
        setProfileImage(null);
        setImagePreview(null);
        const fileInput = document.getElementById('profile-image-upload');
        if (fileInput) fileInput.value = '';
        setMessage({ text: 'Profile picture updated successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setMessage({ text: 'Error updating profile picture. Please try again.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } finally {
      setUploading(false);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('profile-image-upload');
    if (fileInput) fileInput.value = '';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-x-black via-gray-900 to-x-black flex items-center justify-center">
        <div className="bg-x-dark-gray rounded-xl p-8 border border-x-border shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-x-blue mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading profile...</p>
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
              
              {/* Upload Button */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-x-blue to-purple-600 rounded-full p-3 cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg border-4 border-x-dark-gray group">
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
                <label htmlFor="profile-image-upload" className="flex items-center justify-center cursor-pointer w-full h-full">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </label>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{user?.fullName}</h1>
              <p className="text-lg text-x-text-gray mb-1">@{user?.username}</p>
              <p className="text-sm text-x-text-gray mb-6 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {user?.email}
              </p>

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
            </div>
          </div>
        </div>

        {/* Profile Image Upload Preview */}
        {imagePreview && (
          <div className="bg-x-dark-gray/80 backdrop-blur-xl rounded-2xl border border-x-border p-6 shadow-2xl shadow-black/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-x-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Update Profile Picture
            </h3>
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-x-border shadow-lg" 
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-x-blue/20 to-purple-500/20"></div>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  className="bg-gradient-to-r from-x-blue to-purple-600 text-white border-none rounded-xl py-3 px-6 text-sm font-bold cursor-pointer transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2" 
                  onClick={handleUpdateProfileImage}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Update Profile Picture
                    </>
                  )}
                </button>
                <button 
                  className="bg-transparent text-x-text-gray border border-x-border rounded-xl py-3 px-6 text-sm font-bold cursor-pointer transition-all duration-300 hover:bg-x-light-gray hover:border-x-text-gray hover:text-white flex items-center justify-center gap-2" 
                  onClick={removeProfileImage}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Following List */}
        {followingUsers.length > 0 && (
          <div className="bg-x-dark-gray/80 backdrop-blur-xl rounded-2xl border border-x-border p-6 shadow-2xl shadow-black/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-x-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              Following ({followingUsers.length})
            </h3>
            <div className="grid gap-4">
              {followingUsers.map((followedUser, index) => (
                <div 
                  key={followedUser._id} 
                  className="flex items-center gap-4 p-4 bg-x-light-gray/50 border border-x-border rounded-xl hover:bg-x-light-gray/70 transition-all duration-300 hover:scale-[1.02] group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img 
                      src={followedUser.profileImg || 'https://via.placeholder.com/50'} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-x-border shadow-md group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-x-dark-gray"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white group-hover:text-x-blue transition-colors duration-300">
                      {followedUser.fullName}
                    </div>
                    <div className="text-sm text-x-text-gray">@{followedUser.username}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-x-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Following */}
        {followingUsers.length === 0 && user?.following?.length === 0 && (
          <div className="bg-x-dark-gray/80 backdrop-blur-xl rounded-2xl border border-x-border p-8 shadow-2xl shadow-black/20 text-center">
            <div className="w-16 h-16 bg-x-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-x-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Following Yet</h3>
            <p className="text-x-text-gray">Start following other users to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
