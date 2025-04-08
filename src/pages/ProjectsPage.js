import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ProjectList from '../components/projects/ProjectList';
import AddIcon from '@mui/icons-material/Add';

const ProjectsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 3 }}>
        <Typography variant="h5" component="h1">
          Projects
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/projects/create"
        >
          New Project
        </Button>
      </Box>
      <ProjectList />
    </Container>
  );
};

export default ProjectsPage;
