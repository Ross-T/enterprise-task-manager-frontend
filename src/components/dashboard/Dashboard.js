import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom>
          Welcome, {user?.username || 'User'}!
        </Typography>
        <Typography paragraph>
          This is the dashboard of the Enterprise Task Manager application.
          Here you'll see your tasks and projects once they're implemented.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
