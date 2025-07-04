import api from './api';

const adminService = {
  // Dashboard Statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/applications/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Applications Management
  async getApplications(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.status) params.append('status', filters.status);
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.year) params.append('year', filters.year);
      if (filters.role) params.append('role', filters.role);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/applications?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  async getApplicationById(id) {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  async updateApplicationStatus(id, status) {
    try {
      const response = await api.patch(`/applications/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  async updateApplication(id, data) {
    try {
      const response = await api.put(`/applications/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  },

  async deleteApplication(id) {
    try {
      const response = await api.delete(`/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },

  // Bulk operations
  async bulkUpdateStatus(applicationIds, status) {
    try {
      const promises = applicationIds.map(id => 
        this.updateApplicationStatus(id, status)
      );
      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('Error bulk updating status:', error);
      throw error;
    }
  },

  // Export data
  async exportApplications(format = 'csv') {
    try {
      const response = await api.get(`/applications/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting applications:', error);
      throw error;
    }
  },

  // Authentication
  async adminLogin(credentials) {
    try {
      const response = await api.post('/admin/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async adminLogout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('adminUser');
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Check if admin is logged in
  isAdminLoggedIn() {
    return !!localStorage.getItem('token');
  },

  getAdminUser() {
    const adminUser = localStorage.getItem('adminUser');
    return adminUser ? JSON.parse(adminUser) : null;
  }
};

export default adminService;
