import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user }) => {
  // If no user is provided, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, render the protected content
  return children;
};

export default ProtectedRoute;

