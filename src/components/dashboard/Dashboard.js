import React, { useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button
} from '@mui/material';
import { useAuth } from '../../context/authContext';
import { TaskContext } from '../../context/taskContext';
import { ProjectContext } from '../../context/projectContext';
import { Link } from 'react-router-dom';
import TaskPriorityChip from '../tasks/TaskPriorityChip';
import TaskStatusChip from '../tasks/TaskStatusChip';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderIcon from '@mui/icons-material/Folder';

const Dashboard = () => {
  const { user } = useAuth();
  const { state: { tasks, loading: tasksLoading }, fetchTasks } = useContext(TaskContext);
  const { state: { projects, loading: projectsLoading }, fetchProjects } = useContext(ProjectContext);
  
  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);
  
  // Get counts for dashboard stats
  const taskCount = tasks?.length || 0;
  const projectCount = projects?.length || 0;
  
  // Get tasks due in the next 7 days
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const tasksDueSoon = tasks?.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= nextWeek;
  }) || [];
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom>
          Welcome, {user?.username || user?.email || 'User'}!
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Task Count Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, backgroundColor: '#e3f2fd' }}>
              <Typography variant="h5" component="div" gutterBottom>
                Tasks
              </Typography>
              {tasksLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Box display="flex" alignItems="center">
                  <AssignmentIcon sx={{ fontSize: 48, mr: 2, color: 'primary.main' }} />
                  <Typography variant="h3" component="div">
                    {taskCount}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Projects Count Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, backgroundColor: '#e8f5e9' }}>
              <Typography variant="h5" component="div" gutterBottom>
                Projects
              </Typography>
              {projectsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Box display="flex" alignItems="center">
                  <FolderIcon sx={{ fontSize: 48, mr: 2, color: 'success.main' }} />
                  <Typography variant="h3" component="div">
                    {projectCount}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Recent Tasks */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" component="div" gutterBottom>
                Recent Tasks
              </Typography>
              {tasksLoading ? (
                <Box display="flex" justifyContent="center" my={3}>
                  <CircularProgress />
                </Box>
              ) : tasks.length > 0 ? (
                <List>
                  {tasks.slice(0, 5).map((task, index) => (
                    <React.Fragment key={task.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem
                        button
                        component={Link}
                        to={`/tasks/${task.id}`}
                      >
                        <ListItemText 
                          primary={task.title}
                          secondary={
                            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                              <TaskStatusChip status={task.status} />
                              <TaskPriorityChip priority={task.priority} />
                              <Typography variant="body2" component="span" color="text.secondary">
                                {formatDate(task.dueDate)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No tasks available</Typography>
              )}
            </Paper>
          </Grid>

          {/* Tasks Due Soon */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="div">
                  Tasks Due Soon
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/tasks/create"
                >
                  Create Task
                </Button>
              </Box>
              {tasksLoading ? (
                <Box display="flex" justifyContent="center" my={3}>
                  <CircularProgress />
                </Box>
              ) : tasksDueSoon.length > 0 ? (
                <List>
                  {tasksDueSoon.map((task, index) => (
                    <React.Fragment key={task.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem
                        button
                        component={Link}
                        to={`/tasks/${task.id}`}
                      >
                        <ListItemText 
                          primary={task.title}
                          secondary={
                            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                              <TaskStatusChip status={task.status} />
                              <TaskPriorityChip priority={task.priority} />
                              <Typography variant="body2" component="span" color="text.secondary">
                                Due: {formatDate(task.dueDate)}
                              </Typography>
                              {task.projectName && (
                                <Typography variant="body2" component="span" color="text.secondary">
                                  Project: {task.projectName}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No tasks due in the next 7 days</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
