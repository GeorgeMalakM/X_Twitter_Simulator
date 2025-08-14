import Post from './Post';
import Profile from './Profile';
import Notifications from './Notifications';

const DashboardContent = ({ 
  user, 
  onPostCreated, 
  onPostDeleted, 
  onFollowUpdate, 
  onUserUpdate 
}) => {
  return (
    <div className="flex-1 border-r border-x-border min-h-[calc(100vh-60px)] max-w-full m-0 w-full">
      <div className="p-4">
        <div className="max-w-full">
          <Post 
            user={user}
            onPostCreated={onPostCreated}
            onPostDeleted={onPostDeleted}
            onFollowUpdate={onFollowUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
