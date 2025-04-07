import React, { createContext, useReducer, useContext } from 'react';
import * as projectService from '../api/projectService';

// Create context
export const ProjectContext = createContext();

// Initial state
const initialState = {
  projects: [],
  project: null,
  loading: false,
  error: null
};

// Reducer
const projectReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PROJECTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PROJECTS_SUCCESS':
      return {
        ...state,
        projects: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_PROJECT_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PROJECT_SUCCESS':
      return {
        ...state,
        project: action.payload,
        loading: false,
        error: null
      };
    case 'CREATE_PROJECT_SUCCESS':
      return {
        ...state,
        projects: [...state.projects, action.payload],
        project: action.payload,
        loading: false,
        error: null
      };
    case 'UPDATE_PROJECT_SUCCESS':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        project: action.payload,
        loading: false,
        error: null
      };
    case 'DELETE_PROJECT_SUCCESS':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        loading: false,
        error: null
      };
    case 'PROJECT_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'CLEAR_CURRENT_PROJECT':
      return {
        ...state,
        project: null
      };
    default:
      return state;
  }
};

// Provider component
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Fetch all projects
  const fetchProjects = async (page = 0, size = 10) => {
    dispatch({ type: 'FETCH_PROJECTS_REQUEST' });
    try {
      const response = await projectService.getProjects(page, size);
      dispatch({ type: 'FETCH_PROJECTS_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ 
        type: 'PROJECT_ERROR', 
        payload: error.response?.data?.message || 'Failed to fetch projects' 
      });
      throw error;
    }
  };

  // Fetch a single project by ID
  const fetchProjectById = async (id) => {
    dispatch({ type: 'FETCH_PROJECT_REQUEST' });
    try {
      const response = await projectService.getProjectById(id);
      dispatch({ type: 'FETCH_PROJECT_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ 
        type: 'PROJECT_ERROR', 
        payload: error.response?.data?.message || `Failed to fetch project with ID: ${id}`
      });
      throw error;
    }
  };

  // Create a new project
  const createProject = async (projectData) => {
    dispatch({ type: 'FETCH_PROJECT_REQUEST' });
    try {
      const response = await projectService.createProject(projectData);
      dispatch({ type: 'CREATE_PROJECT_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ 
        type: 'PROJECT_ERROR', 
        payload: error.response?.data?.message || 'Failed to create project'
      });
      throw error;
    }
  };

  // Update an existing project
  const updateProject = async (id, projectData) => {
    dispatch({ type: 'FETCH_PROJECT_REQUEST' });
    try {
      const response = await projectService.updateProject(id, projectData);
      dispatch({ type: 'UPDATE_PROJECT_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ 
        type: 'PROJECT_ERROR', 
        payload: error.response?.data?.message || 'Failed to update project'
      });
      throw error;
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    dispatch({ type: 'FETCH_PROJECT_REQUEST' });
    try {
      await projectService.deleteProject(id);
      dispatch({ type: 'DELETE_PROJECT_SUCCESS', payload: id });
    } catch (error) {
      dispatch({ 
        type: 'PROJECT_ERROR', 
        payload: error.response?.data?.message || 'Failed to delete project'
      });
      throw error;
    }
  };

  // Clear any error messages
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Clear current project from state
  const clearCurrentProject = () => {
    dispatch({ type: 'CLEAR_CURRENT_PROJECT' });
  };

  return (
    <ProjectContext.Provider
      value={{
        state,
        fetchProjects,
        fetchProjectById,
        createProject,
        updateProject,
        deleteProject,
        clearError,
        clearCurrentProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
