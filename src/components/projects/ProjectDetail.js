import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProjectContext } from '../../context/projectContext';
import { TaskContext } from '../../context/taskContext';
import TaskList from '../tasks/TaskList';
import { format } from 'date-fns';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { state: { project, loading, error }, fetchProjectById, deleteProject, clearError } = useContext(ProjectContext);
  const { clearError: clearTaskError } = useContext(TaskContext);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch project data only when id or deletion status changes
  useEffect(() => {
    const loadProject = async () => {
      if (!isDeleting && id) {
        try {
          await fetchProjectById(id);
        } catch (err) {
          console.error('Error fetching project:', err);
        }
      }
    };
    
    loadProject();
    
    // Cleanup function
    return () => {
      clearError();
      clearTaskError();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isDeleting]);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      setDeleteDialogOpen(false);
      
      setTimeout(async () => {
        await deleteProject(id);
        navigate('/projects', { replace: true });
      }, 50);
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleteDialogOpen(false);
      setIsDeleting(false);
    }
  };

  if (loading && !isDeleting) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !isDeleting) {
    return (
      <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if ((!project && !loading) && !isDeleting) {
    return (
      <Alert severity="info" sx={{ mt: 3, mb: 2 }}>
        Project not found. It may have been deleted or you don't have access.
      </Alert>
    );
  }

  // Show loading during deletion process
  if (isDeleting) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" my={5}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Deleting project...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              {project.name}
            </Typography>
            
            <Box display="flex" gap={2} mt={1}>
              <Typography variant="body2" color="text.secondary">
                Created: {project.createdAt ? format(new Date(project.createdAt), 'dd MMM yyyy') : 'Not specified'}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <Button 
              startIcon={<EditIcon />} 
              variant="outlined" 
              component={Link} 
              to={`/projects/edit/${id}`}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button 
              startIcon={<DeleteIcon />} 
              variant="outlined" 
              color="error" 
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {project.description || 'No description provided.'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {!isDeleting && (
        <Box mt={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Project Tasks</Typography>
            <Button 
              variant="contained" 
              color="primary"
              component={Link}
              to={`/tasks/create`}
              state={{ returnTo: `/projects/${id}` }}
            >
              Add Task
            </Button>
          </Box>
          <TaskList projectId={id} returnPath={`/projects/${id}`} isDeleting={isDeleting} />
        </Box>
      )}
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete project "{project?.name}"? 
            This will also delete all tasks associated with this project and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetail;
