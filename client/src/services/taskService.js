// client/src/services/taskService.js
import api from './api';

const taskService = {
  // Task Management
  async getTasks(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.active !== undefined) params.append('active', filters.active);

      const response = await api.get(`/tasks?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  async getTask(taskId) {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTask(taskId, taskData) {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Task Assignment Management
  async assignTask(assignmentData) {
    try {
      const response = await api.post('/tasks/assign', assignmentData);
      return response.data;
    } catch (error) {
      console.error('Error assigning task:', error);
      throw error;
    }
  },

  async getAssignments(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.taskId) params.append('taskId', filters.taskId);
      if (filters.applicationId) params.append('applicationId', filters.applicationId);

      const response = await api.get(`/tasks/assignments/list?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  async getAssignment(assignmentId) {
    try {
      const response = await api.get(`/tasks/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  },

  async submitTask(assignmentId, submissionData) {
    try {
      const response = await api.put(`/tasks/assignments/${assignmentId}/submit`, submissionData);
      return response.data;
    } catch (error) {
      console.error('Error submitting task:', error);
      throw error;
    }
  },

  async evaluateAssignment(assignmentId, evaluationData) {
    try {
      const response = await api.put(`/tasks/assignments/${assignmentId}/evaluate`, evaluationData);
      return response.data;
    } catch (error) {
      console.error('Error evaluating assignment:', error);
      throw error;
    }
  },

  async getAssignmentStats() {
    try {
      const response = await api.get('/tasks/assignments/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment stats:', error);
      throw error;
    }
  },

  // Utility functions
  getStatusColor(status) {
    const colors = {
      'Assigned': 'bg-blue-500',
      'In Progress': 'bg-yellow-500',
      'Submitted': 'bg-green-500',
      'Evaluated': 'bg-purple-500',
      'Overdue': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  },

  getDifficultyColor(difficulty) {
    const colors = {
      'Easy': 'bg-green-500',
      'Medium': 'bg-yellow-500',
      'Hard': 'bg-red-500'
    };
    return colors[difficulty] || 'bg-gray-500';
  },

  formatTimeLimit(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  },

  isOverdue(dueDate) {
    return new Date() > new Date(dueDate);
  },

  getTimeRemaining(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    
    if (diff <= 0) {
      return 'Overdue';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
};

export default taskService;
