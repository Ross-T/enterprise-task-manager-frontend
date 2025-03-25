import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { TaskContext } from "../../context/taskContext";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TaskStatusChip from "./TaskStatusChip";
import TaskPriorityChip from "./TaskPriorityChip";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";

const TaskList = () => {
  const {
    state: { tasks, loading, error },
    fetchTasks,
    deleteTask,
    clearError,
  } = useContext(TaskContext);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // Auto-dismiss errors after 5 seconds
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleEditClick = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(taskToDelete.id);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      setDeleteDialogOpen(false);
      console.error("Delete failed:", err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  if (loading && tasks.length === 0) {
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

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Tasks
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/tasks/create"
        >
          Create Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {tasks.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1">
            No tasks found. Create a new task to get started!
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                {index > 0 && <Divider />}
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditClick(task.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(task)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography
                        component={Link}
                        to={`/tasks/${task.id}`}
                        color="textPrimary"
                        sx={{
                          textDecoration: "none",
                          fontWeight: "medium",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {task.title}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "block" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {task.description?.length > 100
                            ? `${task.description.substring(0, 100)}...`
                            : task.description}
                        </Typography>
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          <TaskStatusChip status={task.status} />
                          <TaskPriorityChip priority={task.priority} />
                          {task.projectName && (
                            <Chip
                              label={task.projectName}
                              size="small"
                              variant="outlined"
                              component={Link}
                              to={`/projects/${task.projectId}`}
                              clickable
                            />
                          )}
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Task"
        content={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default TaskList;
