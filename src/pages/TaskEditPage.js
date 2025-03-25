import React from 'react';
import { Container } from '@mui/material';
import TaskForm from '../components/tasks/TaskForm';

const TaskEditPage = () => {
  return (
    <Container maxWidth="lg">
      <TaskForm />
    </Container>
  );
};

export default TaskEditPage;
