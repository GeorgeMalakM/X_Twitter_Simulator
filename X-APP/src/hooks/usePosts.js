import { useState, useEffect } from "react";
import axios from "axios";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/posts/all", {
        withCredentials: true,
      });

      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const updatePost = (postId, updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, ...updatedPost } : post
      )
    );
  };

  const removePost = async (postId) => {
    try {
      const response = await axios.delete(`/api/posts/delete/${postId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
        return { success: true, message: "Post deleted successfully!" };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to delete post",
        };
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      let errorMessage = "Error deleting post. Please try again.";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Post not found. It may have been deleted already.";
        } else if (error.response.status === 401) {
          errorMessage = "You are not authorized to delete this post.";
        } else if (error.response.status === 403) {
          errorMessage = "You are not authorized to delete this post.";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage =
            error.response.data.message || `Error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      return { success: false, message: errorMessage };
    }
  };

  const updatePostLikes = async (postId, userId, isLiked) => {
    try {
      const response = await axios.post(
        `/api/posts/like/${postId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the posts state based on the server response
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              // Toggle the like status based on current state
              const currentLikes = post.likes || [];
              const isCurrentlyLiked = currentLikes.includes(userId);

              return {
                ...post,
                likes: isCurrentlyLiked
                  ? currentLikes.filter((id) => id !== userId) // Remove like
                  : [...currentLikes, userId], // Add like
              };
            }
            return post;
          })
        );
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to update like",
        };
      }
    } catch (error) {
      console.error("Error updating like:", error);
      return {
        success: false,
        message: "Error updating like. Please try again.",
      };
    }
  };

  const addComment = async (postId, commentText) => {
    try {
      const response = await axios.post(
        `/api/posts/comment/${postId}`,
        {
          text: commentText,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newComment = response.data.comment;
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: [...(post.comments || []), newComment] }
              : post
          )
        );
        return { success: true, message: "Comment added successfully!" };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to add comment",
        };
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      let errorMessage = "Error adding comment. Please try again.";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Post not found. It may have been deleted.";
        } else if (error.response.status === 401) {
          errorMessage = "You must be logged in to comment.";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage =
            error.response.data.message || `Error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      return { success: false, message: errorMessage };
    }
  };

  const updateComment = async (postId, commentId, updatedComment) => {
    try {
      const response = await axios.post(
        `/api/posts/edit-comment/${commentId}`,
        {
          text: updatedComment.text,
          postId,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: post.comments.map((c) =>
                    c._id === commentId ? { ...c, ...updatedComment } : c
                  ),
                }
              : post
          )
        );
        return { success: true, message: "Comment updated successfully!" };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to update comment",
        };
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      let errorMessage = "Error updating comment. Please try again.";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Comment not found. It may have been deleted.";
        } else if (error.response.status === 401) {
          errorMessage = "You are not authorized to edit this comment.";
        } else if (error.response.status === 403) {
          errorMessage = "You are not authorized to edit this comment.";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage =
            error.response.data.message || `Error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      return { success: false, message: errorMessage };
    }
  };

  const removeComment = async (postId, commentId) => {
    try {
      const response = await axios.delete(
        `/api/posts/delete-comment/${commentId}`,
        {
          data: { postId },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: post.comments.filter((c) => c._id !== commentId),
                }
              : post
          )
        );
        return { success: true, message: "Comment deleted successfully!" };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to delete comment",
        };
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      let errorMessage = "Error deleting comment. Please try again.";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Comment not found. It may have been deleted already.";
        } else if (error.response.status === 401) {
          errorMessage = "You are not authorized to delete this comment.";
        } else if (error.response.status === 403) {
          errorMessage = "You are not authorized to delete this comment.";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage =
            error.response.data.message || `Error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      return { success: false, message: errorMessage };
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts,
    addPost,
    updatePost,
    removePost,
    updatePostLikes,
    addComment,
    updateComment,
    removeComment,
  };
};
