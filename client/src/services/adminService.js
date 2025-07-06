import api from './api';

const adminService = {
  // Dashboard Statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/stats/overview');
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
      
      // If status is 'Shortlisted', auto-create interview slots
      if (status === 'Shortlisted') {
        try {
          await this.autoCreateSlots({ daysAhead: 7, slotsPerDay: 6 });
        } catch (error) {
          console.log('Note: Auto-create slots failed, but status update succeeded');
        }
      }
      
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

  // Interview Scheduling
  async getInterviewSlots(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.available) params.append('available', filters.available);

      const response = await api.get(`/interview/slots?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching interview slots:', error);
      throw error;
    }
  },

  async createInterviewSlots(data) {
    try {
      const response = await api.post('/interview/slots', data);
      return response.data;
    } catch (error) {
      console.error('Error creating interview slots:', error);
      throw error;
    }
  },

  async autoCreateSlots(options = {}) {
    try {
      const response = await api.post('/interview/auto-create-slots', options);
      return response.data;
    } catch (error) {
      console.error('Error auto-creating slots:', error);
      throw error;
    }
  },

  async autoAssignInterviews() {
    try {
      const response = await api.post('/interview/assign');
      return response.data;
    } catch (error) {
      console.error('Error auto-assigning interviews:', error);
      throw error;
    }
  },

  async rescheduleInterview(applicationId, newSlotId) {
    try {
      const response = await api.post(`/interview/reschedule/${applicationId}`, {
        newSlotId
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling interview:', error);
      throw error;
    }
  },

  async exportInterviewData() {
    try {
      const response = await api.get('/interview/export', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting interview data:', error);
      throw error;
    }
  },

  // CSV Export for applications
  async exportApplicationsCSV() {
    try {
      const applications = await this.getApplications({ limit: 1000 });
      const csv = this.convertToCSV(applications.applications);
      return csv;
    } catch (error) {
      console.error('Error exporting applications:', error);
      throw error;
    }
  },

  convertToCSV(applications) {
    if (!applications || applications.length === 0) {
      return '';
    }

    const headers = [
      'Name', 'Email', 'Phone', 'Branch', 'Year', 'Role', 'Status',
      'Skills', 'Experience', 'GitHub', 'LinkedIn', 'Portfolio', 'Created Date'
    ];

    const rows = applications.map(app => [
      app.name || '',
      app.email || '',
      app.phone || '',
      app.branch || '',
      app.year || '',
      app.role || '',
      app.status || '',
      (app.skills || []).join('; '),
      app.experience || '',
      app.github || '',
      app.linkedin || '',
      app.portfolio || '',
      new Date(app.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return csvContent;
  },

  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
