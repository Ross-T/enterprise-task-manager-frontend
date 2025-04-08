import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TaskContext } from "../../context/taskContext";
import TaskStatusChip from "./TaskStatusChip";
import TaskPriorityChip from "./TaskPriorityChip";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    state: { task, loading, error },
    fetchTaskById,
    deleteTask,
    clearError,
  } = useContext(TaskContext);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchTaskById(id);
    
    // Clear error when component unmounts
    return () => {
      if (clearError) clearError();
    };
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
      navigate('/tasks');
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleteDialogOpen(false);
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
      <Alert severity="error" sx={{ mt: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!task) {
    return (
      <Alert severity="info" sx={{ mt: 3 }}>
        Task not found. It may have been deleted.
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
          to="/tasks"
          sx={{ mr: 2 }}
        >
          Back to Tasks
        </Button>
        
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Task Details
        </Typography>
        
        <Box>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={handleEditClick}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Box mb={3}>
          <Typography variant="h4" gutterBottom>
            {task.title}
          </Typography>
          
          <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
            <TaskStatusChip status={task.status} />
            <TaskPriorityChip priority={task.priority} />
          </Box>
          
          {task.projectName && (
            <Chip
              label={task.projectName}
              color="primary"
              variant="outlined"
              size="small"
              component={Link}
              to={`/projects/${task.projectId}`}
              sx={{ textDecoration: 'none' }}
              clickable
            />
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {task.description || "No description provided."}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body1">
              {task.createdAt
                ? format(new Date(task.createdAt), "dd MMM yyyy HH:mm")
                : "Not specified"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Due Date
            </Typography>
            <Typography variant="body1">
              {task.dueDate
                ? format(new Date(task.dueDate), "dd MMM yyyy HH:mm")
                : "Not specified"}
            </Typography>
          </Grid>

          {task.projectId && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Project
              </Typography>
              <Typography
                variant="body1"
                component={Link}
                to={`/projects/${task.projectId}`}
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {task.projectName}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Task"
        content={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default TaskDetail;
