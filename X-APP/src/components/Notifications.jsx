import { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';
import { useUser } from '../hooks';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', id: null });
  const { user } = useUser();

  useEffect(() => {
    document.title = 'Notifications';
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/notifications/unread', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const showDeleteNotificationModal = (notificationId) => {
    setConfirmAction({ type: 'delete-notification', id: notificationId });
    setShowConfirmModal(true);
  };

  const showClearAllModal = () => {
    setConfirmAction({ type: 'clear-all-notifications', id: null });
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmAction.type === 'delete-notification') {
      await handleDeleteNotification(confirmAction.id);
    } else if (confirmAction.type === 'clear-all-notifications') {
      await handleClearAll();
    }
    setShowConfirmModal(false);
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        if (unreadCount > 0) {
          setUnreadCount(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await axios.delete('/api/notifications/clear', {
        withCredentials: true
      });
      
      if (response.data.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-x-blue fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'like':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-500 fill-current">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case 'reshare':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-green-500 fill-current">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
        );
      case 'comment':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-x-blue fill-current">
            <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-x-text-gray fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  const getNotificationText = (notification) => {
    const { from, type } = notification;
    const username = from?.username || 'Someone';
    
    switch (type) {
      case 'follow':
        return `${username} started following you`;
      case 'like':
        return `${username} liked your post`;
      case 'reshare':
        return `${username} reshared your post`;
      case 'comment':
        return `${username} commented on your post`;
      default:
        return `${username} interacted with your content`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-x-black via-gray-900 to-x-black flex items-center justify-center">
        <div className="bg-x-dark-gray rounded-xl p-8 border border-x-border shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-x-blue mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading notifications...</p>
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
        {/* Header */}
        <div className="bg-x-dark-gray/80 backdrop-blur-xl rounded-2xl border border-x-border p-6 shadow-2xl shadow-black/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                  <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2C8.027 2 4.692 4.836 4.132 8.667L2.086 17.5H21.916L19.993 9.042zM12 20.5c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-x-text-gray text-sm">
                  {notifications.length > 0 ? `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}` : 'No notifications yet'}
                </p>
              </div>
            </div>
            {notifications.length > 0 && (
              <button 
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg" 
                onClick={showClearAllModal}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-x-dark-gray/80 backdrop-blur-xl rounded-2xl border border-x-border p-12 shadow-2xl shadow-black/20 text-center">
            <div className="w-20 h-20 bg-x-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-x-blue fill-current">
                <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2C8.027 2 4.692 4.836 4.132 8.667L2.086 17.5H21.916L19.993 9.042zM12 20.5c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
            <p className="text-x-text-gray">You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div 
                key={notification._id} 
                className={`bg-x-dark-gray/80 backdrop-blur-xl rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                  !notification.read ? 'border-x-blue/30 bg-x-blue/5' : 'border-x-border'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={notification.from?.profileImg || 'https://via.placeholder.com/50'} 
                      alt={notification.from?.fullName || 'User'} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-x-border shadow-md"
                    />
                  </div>
                  
                  <div className="flex-1 flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white text-base mb-2 font-medium">{getNotificationText(notification)}</p>
                      <span className="text-x-text-gray text-sm">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    className="flex-shrink-0 p-2 text-x-text-gray hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-300 hover:scale-110" 
                    onClick={() => showDeleteNotificationModal(notification._id)}
                    title="Delete notification"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          showConfirmModal={showConfirmModal}
          confirmAction={confirmAction}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      </div>
    </div>
  );
};

export default Notifications;
