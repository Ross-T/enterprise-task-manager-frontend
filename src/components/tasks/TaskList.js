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
import ErrorBoundary from "../common/ErrorBoundary";

const TaskList = ({ projectId, returnPath = "/tasks", isDeleting = false }) => {
  const {
    state: { tasks, loading, error },
    fetchTasks,
    fetchTasksByProject,
    deleteTask,
    clearError,
  } = useContext(TaskContext);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Skip loading if the project is being deleted
        if (isDeleting) {
          return;
        }
        
        if (projectId) {
          await fetchTasksByProject(projectId);
        } else {
          await fetchTasks();
        }
        setFetchError(null);
      } catch (err) {
        if (err.response && err.response.status === 404 && projectId) {
          setFetchError("Project no longer exists");
          console.log("Project not found, it may have been deleted");
        }
      }
    };
    
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, isDeleting]);

  useEffect(() => {
    // Auto-dismiss errors after 5 seconds
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

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
      console.error("Delete failed:", err);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  return (
    <ErrorBoundary>
      <Box sx={{ mt: 3, mb: 3 }}>
        {!projectId && (
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
              state={{ returnTo: returnPath }}
            >
              Create Task
            </Button>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {fetchError && projectId && (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              {fetchError}
            </Alert>
          </Paper>
        )}

        {loading && tasks.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100px"
          >
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1">
              {projectId 
                ? "No tasks found for this project. Add a task to get started!"
                : "No tasks found. Create a new task to get started!"}
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
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Link
                          to={`/tasks/${task.id}`}
                          state={{ returnTo: returnPath }}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {task.title}
                        </Link>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component="span"
                            sx={{ display: "block", mb: 1 }}
                          >
                            {task.description
                              ? task.description.length > 100
                                ? `${task.description.substring(0, 100)}...`
                                : task.description
                              : "No description"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              flexWrap: "wrap",
                              alignItems: "center",
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
                                sx={{ maxWidth: 150 }}
                              />
                            )}
                          </Box>
                        </Box>
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
          content={`Are you sure you want to delete the task "${
            taskToDelete?.title || ""
          }"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </Box>
    </ErrorBoundary>
  );
};

export default TaskList;
