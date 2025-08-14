import { usePostActions } from '../hooks/usePostActions';
import { usePostEditing } from '../hooks/usePostEditing';
import { useComments } from '../hooks/useComments';
import { useState } from 'react';

const PostItem = ({ 
  post, 
  user, 
  onFollowUpdate, 
  onPostDeleted, 
  updatePostLikes, 
  removePost, 
  addComment, 
  updateComment, 
  removeComment,
  showDeletePostModal,
  showDeleteCommentModal,
  showMessage,
  formatDate
}) => {
  const [followLoading, setFollowLoading] = useState(false);
  
  const { handleLike, handleReshare, handleDelete, handleEditPost, deletingPosts, editLoading } = usePostActions(
    user, 
    updatePostLikes, 
    removePost, 
    onPostDeleted
  );
  
  const { 
    editingPost, 
    isEditing, 
    startEditing, 
    handleEditImageUpload, 
    removeEditImage, 
    updateEditText, 
    cancelEditing, 
    finishEditing 
  } = usePostEditing();

  const {
    commentInputs,
    editingComment,
    deletingComments,
    handleCommentInputChange,
    submitComment,
    startEditComment,
    cancelEditComment,
    updateEditingCommentText,
    saveEditComment,
    deleteComment
  } = useComments(addComment, updateComment, removeComment);

  const handleFollowClick = async (userId) => {
    if (followLoading) return;
    setFollowLoading(true);
    try {
      await onFollowUpdate(userId);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleEditPostClick = () => {
    startEditing(post._id, post);
  };

  const handleSaveEdit = async () => {
    const result = await handleEditPost(
      editingPost.id, 
      editingPost.text, 
      editingPost.image || editingPost.imagePreview
    );
    
    if (result.success) {
      showMessage(result.message, 'success');
      finishEditing();
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleReshareClick = async () => {
    const result = await handleReshare(post._id);
    if (result.success) {
      showMessage(result.message, 'success');
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleDeleteClick = () => {
    showDeletePostModal(post._id, post);
  };

  const handleCommentSubmit = async (postId) => {
    console.log('Submitting comment for post:', postId);
    const result = await submitComment(postId);
    if (!result.success) {
      showMessage(result.message, 'error');
    } else {
      console.log('Comment submitted successfully');
    }
  };

  const handleCommentDelete = async (postId, commentId) => {
    const result = await deleteComment(postId, commentId);
    if (!result.success) {
      showMessage(result.message, 'error');
    }
  };

  const handleCommentSave = async () => {
    const result = await saveEditComment();
    if (!result.success) {
      showMessage(result.message, 'error');
    }
  };

  return (
    <div 
      className={`max-w-2xl mx-auto bg-x-dark-gray rounded-xl border border-x-border p-6 mb-6 shadow-lg transition-all duration-300 ease-in-out ${
        deletingPosts.has(post._id) 
          ? 'opacity-0 scale-95 -translate-y-2' 
          : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      <div className="flex items-start gap-4 mb-4">
        <img 
          src={post.user?.profileImg || 'https://via.placeholder.com/48'} 
          alt="Profile" 
          className="w-12 h-12 rounded-full object-cover border-2 border-x-border"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-bold text-white text-lg">{post.user?.fullName}</span>
            <span className="text-x-text-gray text-sm">@{post.user?.username}</span>
            <span className="text-x-text-gray text-xs">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        
        {/* Action buttons container */}
        <div className="flex items-center gap-2">
          {post.user?._id !== user?._id && (
            <button 
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                followLoading 
                  ? 'bg-x-text-gray text-x-black opacity-50 cursor-not-allowed'
                  : user?.following?.some(id => String(id) === String(post.user?._id))
                    ? 'bg-x-text-gray text-x-black hover:bg-x-hover-gray hover:scale-105' 
                    : 'bg-x-blue text-white hover:bg-x-blue-hover hover:scale-105 shadow-md'
              }`}
              onClick={() => handleFollowClick(post.user?._id)}
              disabled={followLoading}
            >
              {followLoading ? 'Following...' : (user?.following?.some(id => String(id) === String(post.user?._id)) ? 'Following' : 'Follow')}
            </button>
          )}
          
          {post.user?._id === user?._id && (
            <div className="flex items-center gap-2">
              <button 
                className="p-2 text-x-text-gray hover:text-x-blue hover:bg-x-blue/10 rounded-full transition-all duration-200 hover:scale-110 group"
                onClick={handleEditPostClick}
                title="Edit post"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current group-hover:scale-110 transition-transform">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
              <button 
                className="p-2 text-x-text-gray hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200 hover:scale-110 group"
                onClick={handleDeleteClick}
                title="Delete post"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current group-hover:scale-110 transition-transform">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        {post.isReshare && (
          <div className="flex items-center gap-2 text-green-400 text-sm mb-3 bg-green-400/10 px-3 py-2 rounded-lg">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.54 2.54V15c0-3.31-2.69-6-6-6s-6 2.69-6 6v3.21l-2.54-2.54c-.292-.293-.767-.293-1.06 0s-.292.767 0 1.06l3.77 3.77c.292.293.767.293 1.06 0l3.77-3.77c.292-.293.292-.767 0-1.06z"/>
            </svg>
            <span className="font-medium">Reposted</span>
          </div>
        )}
        
        {/* Edit Post UI */}
        {editingPost.id === post._id ? (
          <div className="space-y-4">
            <textarea
              value={editingPost.text}
              onChange={(e) => updateEditText(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-4 bg-x-light-gray border border-x-border rounded-xl text-white placeholder-x-text-gray focus:outline-none focus:border-x-blue focus:ring-2 focus:ring-x-blue/20 resize-none text-lg"
              rows="4"
            />
            
            {editingPost.imagePreview && (
              <div className="relative rounded-xl overflow-hidden">
                <img src={editingPost.imagePreview} alt="Preview" className="w-full max-h-96 object-cover" />
                <button 
                  className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-2 hover:bg-black/90 transition-all duration-200 hover:scale-110"
                  onClick={removeEditImage}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id={`edit-post-image-${post._id}`}
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="hidden"
                />
                <label 
                  htmlFor={`edit-post-image-${post._id}`} 
                  className="p-3 text-x-blue hover:bg-x-blue/10 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                    <path d="M14 14h2v-4h-2v4zm-2-6h6v2h-6V8zm-2 4h2V8h-2v4z"/>
                  </svg>
                </label>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={cancelEditing}
                  className="px-6 py-3 bg-x-text-gray text-white rounded-full font-semibold hover:bg-x-hover-gray transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="px-6 py-3 bg-x-blue text-white rounded-full font-semibold hover:bg-x-blue-hover transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {post.text && <p className="text-white text-lg leading-relaxed mb-4">{post.text}</p>}
            {post.img && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <img src={post.img} alt="Post" className="w-full object-cover" />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Post Actions and Comments - Only show when not editing */}
      {editingPost.id !== post._id && (
        <>
          <div className="flex items-center gap-8 border-t border-x-border pt-4">
            <button 
              className={`flex items-center gap-3 text-x-text-gray hover:text-red-500 transition-all duration-200 hover:scale-105 group ${
                post.likes.includes(user?._id) ? 'text-red-500' : ''
              }`}
              onClick={() => handleLike(post._id)}
            >
              <div className={`p-2 rounded-full transition-all duration-200 group-hover:bg-red-500/10 ${
                post.likes.includes(user?._id) ? 'bg-red-500/20' : ''
              }`}>
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"/>
                </svg>
              </div>
              <span className="font-medium">{post.likes.length}</span>
            </button>
            
            <button 
              className="flex items-center gap-3 text-x-text-gray hover:text-x-blue transition-all duration-200 hover:scale-105 group"
              onClick={handleReshareClick}
            >
              <div className="p-2 rounded-full transition-all duration-200 group-hover:bg-x-blue/10">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.54 2.54V15c0-3.31-2.69-6-6-6s-6 2.69-6 6v3.21l-2.54-2.54c-.292-.293-.767-.293-1.06 0s-.292.767 0 1.06l3.77 3.77c.292.293.767.293 1.06 0l3.77-3.77c.292-.293.292-.767 0-1.06z"/>
                </svg>
              </div>
              <span className="font-medium">Reshare</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-6 border-t border-x-border pt-4">
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-4 mb-4">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3 group">
                    <img
                      src={comment.user?.profileImg || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border border-x-border"
                    />
                    <div className="flex-1 bg-x-light-gray rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white text-sm">{comment.user?.fullName || 'User'}</span>
                        <span className="text-x-text-gray text-xs">@{comment.user?.username || 'username'}</span>
                      </div>
                      {editingComment.id === comment._id ? (
                        <div className="space-y-3">
                          <input
                            value={editingComment.text}
                            onChange={(e) => updateEditingCommentText(e.target.value)}
                            className="w-full p-3 bg-x-dark-gray border border-x-border rounded-lg text-white text-sm focus:outline-none focus:border-x-blue focus:ring-2 focus:ring-x-blue/20"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleCommentSave} className="px-4 py-2 bg-x-blue text-white text-sm rounded-lg hover:bg-x-blue-hover transition-all duration-200 hover:scale-105">Save</button>
                            <button onClick={cancelEditComment} className="px-4 py-2 bg-x-text-gray text-white text-sm rounded-lg hover:bg-x-hover-gray transition-all duration-200 hover:scale-105">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-white text-sm leading-relaxed">{comment.text}</p>
                      )}
                    </div>
                    {(comment.user?._id === user?._id) && editingComment.id !== comment._id && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => startEditComment(post._id, comment)} 
                          className="p-2 text-x-blue hover:bg-x-blue/10 rounded-full transition-all duration-200 hover:scale-110"
                          title="Edit comment"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => showDeleteCommentModal(post._id, comment._id)} 
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200 hover:scale-110"
                          title="Delete comment"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add comment */}
            <div className="flex gap-3">
              <img
                src={user?.profileImg || 'https://via.placeholder.com/40'}
                alt="Your Profile"
                className="w-10 h-10 rounded-full object-cover border border-x-border"
              />
              <div className="flex-1 flex gap-3">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInputs[post._id] || ''}
                  onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                  className="flex-1 p-3 bg-x-light-gray border border-x-border rounded-xl text-white placeholder-x-text-gray text-sm focus:outline-none focus:border-x-blue focus:ring-2 focus:ring-x-blue/20"
                />
                <button 
                  onClick={() => handleCommentSubmit(post._id)} 
                  disabled={!commentInputs[post._id]?.trim()}
                  className="px-6 py-3 bg-x-blue text-white text-sm font-semibold rounded-xl hover:bg-x-blue-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostItem;
