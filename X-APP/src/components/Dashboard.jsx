import { useEffect } from 'react';
import Post from './Post';
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

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

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
      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-24">
        <Post 
          user={user}
          onPostCreated={handlePostCreated}
          onPostDeleted={handlePostDeleted}
          onFollowUpdate={handleFollowUpdate}
        />
      </div>
    </div>
  );
};

export default Dashboard; 