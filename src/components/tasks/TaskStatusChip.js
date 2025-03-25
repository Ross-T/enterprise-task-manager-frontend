import React from 'react';
import { Chip } from '@mui/material';
import PropTypes from 'prop-types';

const getStatusColor = (status) => {
  switch (status) {
    case 'TODO':
      return '#e0e0e0';
    case 'IN_PROGRESS':
      return '#2196f3';
    case 'REVIEW':
      return '#ff9800';
    case 'DONE':
      return '#4caf50';
    default:
      return '#e0e0e0';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'TODO':
      return 'To Do';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'REVIEW':
      return 'Review';
    case 'DONE':
      return 'Done';
    default:
      return status;
  }
};

const TaskStatusChip = ({ status }) => {
  return (
    <Chip
      label={getStatusLabel(status)}
      size="small"
      sx={{
        backgroundColor: getStatusColor(status),
        color: status === 'TODO' ? 'rgba(0, 0, 0, 0.87)' : '#fff',
        fontWeight: 'medium'
      }}
    />
  );
};

TaskStatusChip.propTypes = {
  status: PropTypes.string.isRequired
};

export default TaskStatusChip;
