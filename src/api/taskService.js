import api from './axiosConfig';

export const getTasks = async (page = 0, size = 10) => {
  return await api.get(`/tasks?page=${page}&size=${size}`);
};

export const getTaskById = async (id) => {
  return await api.get(`/tasks/${id}`);
};

export const createTask = async (task) => {
  return await api.post('/tasks', task);
};

export const updateTask = async (id, task) => {
  return await api.put(`/tasks/${id}`, task);
};

export const deleteTask = async (id) => {
  return await api.delete(`/tasks/${id}`);
};

export const getTasksByProject = async (projectId, page = 0, size = 10) => {
  return await api.get(`/tasks/project/${projectId}?page=${page}&size=${size}`);
};

export const getTasksByStatus = async (status, page = 0, size = 10) => {
  return await api.get(`/tasks/status/${status}?page=${page}&size=${size}`);
};