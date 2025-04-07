import React from 'react';
import { Container } from '@mui/material';
import ProjectForm from '../components/projects/ProjectForm';

const ProjectCreatePage = () => {
  return (
    <Container maxWidth="lg">
      <ProjectForm />
    </Container>
  );
};

export default ProjectCreatePage;
