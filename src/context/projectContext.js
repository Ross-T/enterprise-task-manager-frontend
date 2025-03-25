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
    case 'PROJECT_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// Provider component
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

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

  return (
    <ProjectContext.Provider value={{ state, fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
