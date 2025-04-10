import React, { createContext, useReducer, useContext, useCallback } from "react";
import * as taskService from "../api/taskService";
import { CircuitBreaker } from "../utils/circuitBreaker";

const circuitBreaker = new CircuitBreaker();

export const TaskContext = createContext();

const initialState = {
  tasks: [],
  task: null,
  loading: false,
  error: null,
  pageInfo: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
};

// Reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_TASKS_REQUEST":
    case "FETCH_TASK_REQUEST":
    case "CREATE_TASK_REQUEST":
    case "UPDATE_TASK_REQUEST":
    case "DELETE_TASK_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_TASKS_SUCCESS":
      return {
        ...state,
        tasks: action.payload.content || action.payload,
        pageInfo: {
          totalPages: action.payload.totalPages || 1,
          totalElements: action.payload.totalElements || action.payload.length,
          currentPage: action.payload.pageable?.pageNumber || 0,
          pageSize: action.payload.pageable?.pageSize || action.payload.length,
        },
        loading: false,
        error: null,
      };
    case "FETCH_TASK_SUCCESS":
      return {
        ...state,
        task: action.payload,
        loading: false,
        error: null,
      };
    case "CREATE_TASK_SUCCESS":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false,
        error: null,
      };
    case "UPDATE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        task:
          state.task?.id === action.payload.id ? action.payload : state.task,
        loading: false,
        error: null,
      };
    case "DELETE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        task: state.task?.id === action.payload ? null : state.task,
        loading: false,
        error: null,
      };
    case "TASK_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "CLEAR_TASK_ERROR":
      return {
        ...state,
        error: null,
      };
    case "CLEAR_CURRENT_TASK":
      return {
        ...state,
        task: null,
      };
    default:
      return state;
  }
};

// Provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (page = 0, size = 10) => {
    dispatch({ type: "FETCH_TASKS_REQUEST" });
    try {
      const response = await circuitBreaker.call('task-service', 
        () => taskService.getTasks(page, size));
      dispatch({ type: "FETCH_TASKS_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({
        type: "TASK_ERROR",
        payload: error.response?.data?.message || error.message || "Failed to fetch tasks",
      });
      throw error;
    }
  }, []);

  const fetchTasksByProject = useCallback(async (projectId, page = 0, size = 10) => {
    dispatch({ type: "FETCH_TASKS_REQUEST" });
    try {
      const response = await circuitBreaker.call('task-project-service', 
        () => taskService.getTasksByProject(projectId, page, size));
      dispatch({ type: "FETCH_TASKS_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({
        type: "TASK_ERROR",
        payload: error.message || "Failed to fetch tasks for project",
      });
      throw error;
    }
  }, []);

  const fetchTasksByStatus = useCallback(async (status, page = 0, size = 10) => {
    dispatch({ type: "FETCH_TASKS_REQUEST" });
    try {
      const response = await circuitBreaker.call('task-status-service', 
        () => taskService.getTasksByStatus(status, page, size));
      dispatch({ type: "FETCH_TASKS_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({
        type: "TASK_ERROR",
        payload: error.message || "Failed to fetch tasks by status",
      });
      throw error;
    }
  }, []);

  const fetchTaskById = useCallback(async (id) => {
    dispatch({ type: "FETCH_TASK_REQUEST" });
    try {
      const response = await circuitBreaker.call('task-detail-service', 
        () => taskService.getTaskById(id));
      dispatch({ type: "FETCH_TASK_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({
        type: "TASK_ERROR",
        payload: error.message || `Failed to fetch task with ID: ${id}`,
      });
      throw error;
    }
  }, []);

  const createTask = useCallback(async (task) => {
    dispatch({ type: "CREATE_TASK_REQUEST" });
    try {
      const response = await circuitBreaker.call('task-create-service', 
        () => taskService.createTask(task));
      dispatch({ type: "CREATE_TASK_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({
        type: "TASK_ERROR",
        payload: error.message || "Failed to create task",
      });
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id, task) => {
    dispatch({ type: "UPDATE_TASK_REQUEST" });
    try {
      const response = await circuitBreaker.call('task-update-service', 
        () => taskService.updateTask(id, task));
      dispatch({ type: "UPDATE_TASK_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({
        type: "TASK_ERROR",
        payload: error.message || "Failed to update task",
      });
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    dispatch({ type: "DELETE_TASK_REQUEST" });
    try {
      await circuitBreaker.call('task-delete-service', 
        () => taskService.deleteTask(id));
      dispatch({ type: "DELETE_TASK_SUCCESS", payload: id });
    } catch (error) {
      dispatch({
        type: "TASK_ERROR",
        payload: error.message || "Failed to delete task",
      });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_TASK_ERROR" });
  }, []);

  const clearCurrentTask = useCallback(() => {
    dispatch({ type: "CLEAR_CURRENT_TASK" });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        state,
        fetchTasks,
        fetchTasksByProject,
        fetchTasksByStatus,
        fetchTaskById,
        createTask,
        updateTask,
        deleteTask,
        clearError,
        clearCurrentTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
