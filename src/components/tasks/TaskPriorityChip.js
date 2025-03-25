import React from 'react';
import { Chip } from '@mui/material';
import PropTypes from 'prop-types';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'LOW':
      return '#8bc34a';
    case 'MEDIUM':
      return '#ffeb3b';
    case 'HIGH':
      return '#ff9800';
    default:
      return '#e0e0e0';
  }
};

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'LOW':
      return <ArrowDownwardIcon fontSize="small" />;
    case 'MEDIUM':
      return <RemoveIcon fontSize="small" />;
    case 'HIGH':
      return <ArrowUpwardIcon fontSize="small" />;
    default:
      return null;
  }
};

const TaskPriorityChip = ({ priority }) => {
  return (
    <Chip
      icon={getPriorityIcon(priority)}
      label={priority}
      size="small"
      sx={{
        backgroundColor: getPriorityColor(priority),
        color: priority === 'MEDIUM' ? 'rgba(0, 0, 0, 0.87)' : '#fff',
        fontWeight: 'medium'
      }}
    />
  );
};

TaskPriorityChip.propTypes = {
  priority: PropTypes.string.isRequired
};

export default TaskPriorityChip;
