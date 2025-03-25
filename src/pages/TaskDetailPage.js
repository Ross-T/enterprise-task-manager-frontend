import React from 'react';
import { Container } from '@mui/material';
import TaskDetail from '../components/tasks/TaskDetail';

const TaskDetailPage = () => {
  return (
    <Container maxWidth="lg">
      <TaskDetail />
    </Container>
  );
};

export default TaskDetailPage;
