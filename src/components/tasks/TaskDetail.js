import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Box, Typography, Paper, Button, Chip, Divider, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TaskContext } from "../../context/taskContext";
import TaskStatusChip from "./TaskStatusChip";
import TaskPriorityChip from "./TaskPriorityChip";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import { format } from "date-fns";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const returnPath = location.state?.returnTo || "/tasks";

  const {
    state: { task, loading, error },
    fetchTaskById,
    deleteTask,
    clearError,
  } = useContext(TaskContext);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchTaskById(id);

    return () => clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEditClick = () => {
    navigate(`/tasks/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(id);
      setDeleteDialogOpen(false);
      navigate(returnPath);
    } catch (err) {
      setDeleteDialogOpen(false);
      console.error("Delete failed:", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3, mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!task) {
    return (
      <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
        Task not found
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to={returnPath}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          {task.title}
        </Typography>
        
        <Button 
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleEditClick}
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        
        <Button 
          variant="outlined" 
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClick}
        >
          Delete
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1">
            {task.description || "No description provided"}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Details
          </Typography>
          
          <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <TaskStatusChip status={task.status} />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Priority
              </Typography>
              <TaskPriorityChip priority={task.priority} />
            </Box>
            
            {task.projectName && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Project
                </Typography>
                <Chip 
                  label={task.projectName} 
                  variant="outlined"
                  component={Link}
                  to={`/projects/${task.projectId}`}
                  clickable
                />
              </Box>
            )}
            
            {task.dueDate && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Due Date
                </Typography>
                <Typography>
                  {format(new Date(task.dueDate), "dd/MM/yyyy HH:mm")}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Created At
            </Typography>
            <Typography>
              {format(new Date(task.createdAt), "dd/MM/yyyy HH:mm")}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Task"
        content={`Are you sure you want to delete task "${task.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default TaskDetail;
