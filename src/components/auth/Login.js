import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Alert,
  Avatar,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../context/authContext';

const Login = () => {
  const { login, error: authError, loading, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Create a persistent error state
  const [localError, setLocalError] = useState(() => {
    const savedError = sessionStorage.getItem('loginError');
    return savedError || null;
  });
  
  const [verificationMessage, setVerificationMessage] = useState(null);
  
  // Redirect to the page the user tried to access, or dashboard if directly accessing login
  const from = location.state?.from?.pathname || '/dashboard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Check for email verification flag on component mount
  useEffect(() => {
    const needsVerification = sessionStorage.getItem('needsEmailVerification');
    if (needsVerification === 'true') {
      setVerificationMessage('Please check your email and click the verification link before logging in.');
      sessionStorage.removeItem('needsEmailVerification');
    }
  }, []);
  
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
      sessionStorage.setItem('loginError', authError);
    }
  }, [authError]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    sessionStorage.removeItem('loginError');
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }
    
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      
      const errorMessage = err.response?.data?.message || "Invalid credentials";
      setLocalError(errorMessage);
      sessionStorage.setItem('loginError', errorMessage);
    }
    
    return false;
  };
  
  const handleErrorClose = () => {
    setLocalError(null);
    sessionStorage.removeItem('loginError');
  };

  const handleVerificationClose = () => {
    setVerificationMessage(null);
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            
            {verificationMessage && (
              <Alert 
                severity="info" 
                sx={{ mt: 2, width: '100%', mb: 2 }}
                onClose={handleVerificationClose}
              >
                {verificationMessage}
              </Alert>
            )}
            
            {localError && (
              <Alert 
                severity="error" 
                sx={{ mt: 2, width: '100%', mb: 2 }}
                onClose={handleErrorClose}
              >
                {localError}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              <Box display="flex" justifyContent="center">
                <MuiLink component={Link} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
