import api from './axiosConfig';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  getTasksByProject,
  getTasksByStatus
} from './taskService';

jest.mock('./axiosConfig');

describe('Task Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    const mockTasks = [
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' }
    ];
    const mockResponse = { data: mockTasks };
    
    it('should call api.get with the correct URL', async () => {
      api.get.mockResolvedValueOnce(mockResponse);
      
      await getTasks();
      
      expect(api.get).toHaveBeenCalledWith('/tasks?page=0&size=10');
    });

    it('should support pagination parameters', async () => {
      api.get.mockResolvedValueOnce(mockResponse);
      
      await getTasks(2, 20);
      
      expect(api.get).toHaveBeenCalledWith('/tasks?page=2&size=20');
    });

    it('should return the data from the response', async () => {
      api.get.mockResolvedValueOnce(mockResponse);
      
      const result = await getTasks();
      
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when the request fails', async () => {
      const errorMessage = 'Network error';
      api.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(getTasks()).rejects.toThrow(errorMessage);
    });
  });

  describe('getTaskById', () => {
    const taskId = 1;
    const mockTask = { id: taskId, title: 'Task 1' };
    const mockResponse = { data: mockTask };
    
    it('should call api.get with the correct URL', async () => {
      api.get.mockResolvedValueOnce(mockResponse);
      
      await getTaskById(taskId);
      
      expect(api.get).toHaveBeenCalledWith(`/tasks/${taskId}`);
    });

    it('should return the data from the response', async () => {
      api.get.mockResolvedValueOnce(mockResponse);
      
      const result = await getTaskById(taskId);
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createTask', () => {
    const newTask = { title: 'New Task', description: 'Description', priority: 'HIGH' };
    const createdTask = { id: 1, ...newTask };
    const mockResponse = { data: createdTask };
    
    it('should call api.post with the correct URL and data', async () => {
      api.post.mockResolvedValueOnce(mockResponse);
      
      await createTask(newTask);
      
      expect(api.post).toHaveBeenCalledWith('/tasks', newTask);
    });

    it('should return the data from the response', async () => {
      api.post.mockResolvedValueOnce(mockResponse);
      
      const result = await createTask(newTask);
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateTask', () => {
    const taskId = 1;
    const updatedTask = { title: 'Updated Task', status: 'IN_PROGRESS' };
    const resultTask = { id: taskId, ...updatedTask };
    const mockResponse = { data: resultTask };
    
    it('should call api.put with the correct URL and data', async () => {
      api.put.mockResolvedValueOnce(mockResponse);
      
      await updateTask(taskId, updatedTask);
      
      expect(api.put).toHaveBeenCalledWith(`/tasks/${taskId}`, updatedTask);
    });

    it('should return the data from the response', async () => {
      api.put.mockResolvedValueOnce(mockResponse);
      
      const result = await updateTask(taskId, updatedTask);
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteTask', () => {
    const taskId = 1;
    const mockResponse = { status: 204 };
    
    it('should call api.delete with the correct URL', async () => {
      api.delete.mockResolvedValueOnce(mockResponse);
      
      await deleteTask(taskId);
      
      expect(api.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
    });
  });

  describe('getTasksByProject', () => {
    const projectId = 1;
    const mockTasks = [
      { id: 1, title: 'Task 1', projectId },
      { id: 2, title: 'Task 2', projectId }
    ];
    const mockResponse = { data: mockTasks };
    
    it('should call api.get with the correct URL', async () => {
      api.get.mockResolvedValueOnce(mockResponse);
      
      await getTasksByProject(projectId);
      
      expect(api.get).toHaveBeenCalledWith(`/tasks/project/${projectId}?page=0&size=10`);
    });

    it('should support pagination parameters', async () => {
      api.get.mockResolvedValueOnce(mockResponse);
      
      await getTasksByProject(projectId, 2, 20);
      
      expect(api.get).toHaveBeenCalledWith(`/tasks/project/${projectId}?page=2&size=20`);
    });
  });

  describe('getTasksByStatus', () => {
    const status = 'IN_PROGRESS';
    const mockTasks = [
      { id: 1, title: 'Task 1', status },
      { id: 2, title: 'Task 2', status }
    ];
    const mockResponse = { data: mockTasks };
    
    it('should call api.get with the correct URL', async () => {
      api.get.mockResolvedValueOnce(mockResponse);
      
      await getTasksByStatus(status);
      
      expect(api.get).toHaveBeenCalledWith(`/tasks/status/${status}?page=0&size=10`);
    });

    it('should support pagination parameters', async () => {
      api.get.mockResolvedValueOnce(mockResponse);
      
      await getTasksByStatus(status, 2, 20);
      
      expect(api.get).toHaveBeenCalledWith(`/tasks/status/${status}?page=2&size=20`);
    });
  });
});
