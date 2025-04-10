import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            m: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            The component could not be loaded properly. You can try again or contact support if the problem persists.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </Box>
          {this.props.showErrorDetails && this.state.error && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, width: '100%', overflow: 'auto' }}>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
              </Typography>
            </Box>
          )}
        </Paper>
      );
    }

    // If there's no error render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
