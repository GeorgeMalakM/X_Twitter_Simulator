# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=9000
NODE_ENV=development

# Database Configuration
MONGO_URL=mongodb://localhost:27017/x-clone

# JWT Configuration
ACCESS_TOKEN_SECRET=dev_access_secret_123456789
REFRESH_TOKEN_SECRET=dev_refresh_secret_123456789

# Redis Configuration (for token storage)
REDIS_URL=redis://localhost:6379

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Cookie Configuration
COOKIE_SECRET=dev_cookie_secret_123
```

## Quick Setup for Development

For quick development setup, you can use these minimal values:

```env
PORT=9000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/x-clone
ACCESS_TOKEN_SECRET=dev_access_secret_123456789
REFRESH_TOKEN_SECRET=dev_refresh_secret_123456789
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
COOKIE_SECRET=dev_cookie_secret_123
```

## Important Notes

1. **Never commit .env files** - They're already in .gitignore
2. **Use strong secrets in production** - The example values are for development only
3. **MongoDB must be running** - Start MongoDB service before running the server
4. **Redis must be running** - Start Redis service before running the server
5. **Cloudinary is optional** - Image uploads will fail without it, but the app will still work

## Testing the Setup

After creating the .env file:

1. Start MongoDB: `mongod`
2. Start Redis: `redis-server`
3. Start the backend: `npm run server`
4. Start the frontend: `cd X-APP && npm run dev`
5. Test the connection at: `http://localhost:3000`

## Fixed Issues

✅ **Fixed Delete Post Functionality:**

- Updated `removePost` in `usePosts.js` to send DELETE request to backend
- Updated `removeComment` to send DELETE request to backend
- Updated `updateComment` to send POST request to backend
- Updated `addComment` to send POST request to backend
- Updated `updatePostLikes` to send POST request to backend

✅ **Fixed Backend Responses:**

- Updated `editComment` to return populated comment with user info
- Updated `editPost` to return populated post with user info
- Updated `deletePost` to delete related notifications
- Updated `deleteComment` to delete related notifications

✅ **Enhanced Error Handling:**

- Added comprehensive error handling for all API calls
- Added specific error messages for different HTTP status codes
- Added network error handling
- Added authorization error handling
