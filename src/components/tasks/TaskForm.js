import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TaskContext } from '../../context/taskContext';
import { ProjectContext } from '../../context/projectContext';
import enGB from 'date-fns/locale/en-GB';

const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  
  const returnPath = location.state?.returnTo || (isEditMode ? `/tasks/${id}` : '/tasks');

  const {
    state: { task, loading, error },
    fetchTaskById,
    createTask,
    updateTask,
    clearError,
    clearCurrentTask
  } = useContext(TaskContext);

  const {
    state: { projects },
    fetchProjects
  } = useContext(ProjectContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: null,
    projectId: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProjects();
  
    if (isEditMode) {
      fetchTaskById(id);
    }
  
    // Clear task data when component unmounts
    return () => clearCurrentTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, id]);

  useEffect(() => {
    // Update form data when task is loaded in edit mode
    if (isEditMode && task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        status: task.status || 'TODO',
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        projectId: task.projectId || ''
      });
    }
  }, [isEditMode, task]);

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters long';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({ ...prev, dueDate: newDate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validate()) {
      return;
    }

    try {
      // Format the data for API
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
        projectId: formData.projectId || null
      };

      if (isEditMode) {
        await updateTask(id, taskData);
        // Refresh project data if task has a project
        if (taskData.projectId) {
          fetchProjects();
        }
        navigate(`/tasks/${id}`, { state: { returnTo: returnPath } });
      } else {
        const result = await createTask(taskData);
        // Refresh project data if new task has a project
        if (taskData.projectId) {
          fetchProjects();
        }
        navigate(`/tasks/${result.id}`, { state: { returnTo: returnPath } });
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleCancel = () => {
    navigate(returnPath);
  };

  return (
    <Box component={Paper} sx={{ p: 3, mt: 3, mb: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? 'Edit Task' : 'Create New Task'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={Boolean(formErrors.title)}
                helperText={formErrors.title}
                disabled={loading}
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={Boolean(formErrors.description)}
                helperText={formErrors.description}
                disabled={loading}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority"
                >
                  {TASK_PRIORITIES.map(priority => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {isEditMode && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={loading}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    {TASK_STATUSES.map(status => (
                      <MenuItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} sm={isEditMode ? 6 : 6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <DateTimePicker
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={handleDateChange}
                  inputFormat="dd/MM/yyyy HH:mm"
                  renderInput={(params) => (
                    <TextField {...params} fullWidth disabled={loading} />
                  )}
                  disabled={loading}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel id="project-label">Project (Optional)</InputLabel>
                <Select
                  labelId="project-label"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  label="Project (Optional)"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {isEditMode ? 'Update Task' : 'Create Task'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default TaskForm;
