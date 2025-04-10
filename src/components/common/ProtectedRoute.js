import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Box, CircularProgress } from '@mui/material';

/**
 * A route that requires authentication to access.
 * Redirects to login if not authenticated, displays loading indicator while checking auth status.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @returns {React.ReactNode} The protected component or a redirect
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, initialCheckComplete } = useAuth();
  const location = useLocation();

  if (!initialCheckComplete || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
