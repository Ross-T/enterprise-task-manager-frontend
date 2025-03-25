import api from './axiosConfig';

export const getProjects = async (page = 0, size = 10) => {
  return await api.get(`/projects?page=${page}&size=${size}`);
};

export const getProjectById = async (id) => {
  return await api.get(`/projects/${id}`);
};

export const createProject = async (project) => {
  return await api.post('/projects', project);
};

export const updateProject = async (id, project) => {
  return await api.put(`/projects/${id}`, project);
};

export const deleteProject = async (id) => {
  return await api.delete(`/projects/${id}`);
};
