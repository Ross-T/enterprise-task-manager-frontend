import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { Link as MuiLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// Password strength requirements
const PASSWORD_REQUIREMENTS = [
  { id: 'length', text: 'At least 8 characters', regex: /.{8,}/ },
  { id: 'lowercase', text: 'At least one lowercase letter', regex: /[a-z]+/ },
  { id: 'uppercase', text: 'At least one uppercase letter', regex: /[A-Z]+/ },
  { id: 'number', text: 'At least one number', regex: /[0-9]+/ },
  { id: 'special', text: 'At least one special character', regex: /[^A-Za-z0-9]+/ },
];

const Register = () => {
  const { register, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Registration successful! Redirecting to login..."
  );
  const [emailVerificationRequired, setEmailVerificationRequired] =
    useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    color: "error",
    label: "Very Weak",
    requirements: PASSWORD_REQUIREMENTS.reduce((acc, req) => {
      acc[req.id] = false;
      return acc;
    }, {})
  });

  const calculatePasswordStrength = (password) => {
    if (!password) {
      return {
        score: 0,
        color: "error",
        label: "Very Weak",
        requirements: PASSWORD_REQUIREMENTS.reduce((acc, req) => {
          acc[req.id] = false;
          return acc;
        }, {})
      };
    }

    const requirements = PASSWORD_REQUIREMENTS.reduce((acc, requirement) => {
      acc[requirement.id] = requirement.regex.test(password);
      return acc;
    }, {});
    
    // Calculate score based on met requirements (0-100)
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    const score = (metRequirements / PASSWORD_REQUIREMENTS.length) * 100;
    
    // Determine color and label based on score
    let color, label;
    if (score < 20) {
      color = "error";
      label = "Very Weak";
    } else if (score < 40) {
      color = "error";
      label = "Weak";
    } else if (score < 60) {
      color = "warning";
      label = "Fair";
    } else if (score < 80) {
      color = "info";
      label = "Good";
    } else {
      color = "success";
      label = "Strong";
    }
    
    return { score, color, label, requirements };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }

    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (passwordStrength.score < 60) {
      // Require at least a "Fair" password strength
      const missingRequirements = PASSWORD_REQUIREMENTS.filter(
        req => !passwordStrength.requirements[req.id]
      ).map(req => req.text).join(', ');
      
      errors.password = `Password is too weak. Please ensure: ${missingRequirements}`;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await register(registrationData);
  
      console.log("Registration response:", response);
      setSuccess(true);
      setEmailVerificationRequired(true);
      setSuccessMessage(
        "Registration successful! Please check your email to confirm your account before logging in."
      );
  
      sessionStorage.setItem("needsEmailVerification", "true");
  
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <PersonAddIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity={emailVerificationRequired ? "info" : "success"}
                sx={{ mt: 2, width: "100%" }}
                icon={emailVerificationRequired ? null : undefined}
              >
                {successMessage}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 3, width: "100%" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!formErrors.username}
                    helperText={formErrors.username}
                    disabled={loading || success}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    disabled={loading || success}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    disabled={loading || success}
                  />
                  {formData.password && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Password Strength:</Typography>
                        <Typography variant="body2" color={`${passwordStrength.color}.main`}>
                          {passwordStrength.label}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={passwordStrength.score} 
                        color={passwordStrength.color}
                        sx={{ height: 8, borderRadius: 4 }}
                      />

                      <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
                        Password requirements:
                      </Typography>
                      <List dense disablePadding>
                        {PASSWORD_REQUIREMENTS.map((requirement) => (
                          <ListItem key={requirement.id} disableGutters dense>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {passwordStrength.requirements[requirement.id] ? (
                                <CheckIcon fontSize="small" color="success" />
                              ) : (
                                <CloseIcon fontSize="small" color="error" />
                              )}
                            </ListItemIcon>
                            <ListItemText 
                              primary={requirement.text} 
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    disabled={loading || success}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || success || passwordStrength.score < 60}
              >
                {loading ? <CircularProgress size={24} /> : "Sign Up"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <MuiLink component={Link} to="/login" variant="body2">
                    Already have an account? Sign in
                  </MuiLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
