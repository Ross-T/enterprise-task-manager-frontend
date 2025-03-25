import React from 'react';
import { Container } from '@mui/material';
import TaskList from '../components/tasks/TaskList';

const TasksPage = () => {
  return (
    <Container maxWidth="lg">
      <TaskList />
    </Container>
  );
};

export default TasksPage;
