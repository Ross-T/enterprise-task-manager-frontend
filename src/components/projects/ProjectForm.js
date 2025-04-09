import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { ProjectContext } from '../../context/projectContext';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { state: { project, loading, error }, fetchProjectById, createProject, updateProject, clearError, clearCurrentProject } = useContext(ProjectContext);

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchProjectById(id);
    }
    
    return () => clearCurrentProject();
  }, [isEditMode, id, clearCurrentProject, fetchProjectById]);

  useEffect(() => {
    if (isEditMode && project) {
      setFormData({
        name: project.name || '',
        description: project.description || ''
      });
    }
  }, [isEditMode, project]);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    } else if (formData.name.length > 100) {
      errors.name = 'Name must be less than 100 characters long';
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
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validate()) {
      return;
    }

    try {
      if (isEditMode) {
        await updateProject(id, formData);
        navigate(`/projects/${id}`);
      } else {
        const result = await createProject(formData);
        navigate(`/projects/${result.id}`);
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/projects/${id}`);
    } else {
      navigate('/projects');
    }
  };

  return (
    <Box component={Paper} sx={{ p: 3, mt: 3, mb: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? 'Edit Project' : 'Create New Project'}
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
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
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
                  {isEditMode ? 'Update Project' : 'Create Project'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProjectForm;
