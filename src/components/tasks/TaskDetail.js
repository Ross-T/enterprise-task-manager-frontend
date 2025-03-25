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

    return () => clearError();
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
      navigate("/tasks");
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/tasks"
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  if (!task) {
    return (
      <Box mt={3}>
        <Alert severity="info">Task not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/tasks"
          sx={{ mt: 2 }}
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  return (
    <Box mt={3} mb={3}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/tasks"
          sx={{ mr: 2 }}
        >
          Back
        </Button>

        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Task Details
        </Typography>

        <Box>
          <IconButton
            color="primary"
            aria-label="edit task"
            onClick={handleEditClick}
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            aria-label="delete task"
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box mb={3}>
          <Typography variant="h4" gutterBottom>
            {task.title}
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            <TaskStatusChip status={task.status} />
            <TaskPriorityChip priority={task.priority} />
            {task.projectId && (
              <Chip
                label={task.projectName}
                variant="outlined"
                component={Link}
                to={`/projects/${task.projectId}`}
                clickable
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

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
                ? format(new Date(task.createdAt), "PPP p")
                : "Not specified"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Due Date
            </Typography>
            <Typography variant="body1">
              {task.dueDate
                ? format(new Date(task.dueDate), "PPP p")
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
