import api from './api'

export const applicationService = {
  // Create new application
  create: async (applicationData) => {
    const response = await api.post('/apply', applicationData)
    return response.data
  },

  // Get all applications with filters
  getAll: async (params = {}) => {
    const response = await api.get('/applications', { params })
    return response.data
  },

  // Get single application
  getById: async (id) => {
    const response = await api.get(`/applications/${id}`)
    return response.data
  },

  // Update application
  update: async (id, data) => {
    const response = await api.put(`/applications/${id}`, data)
    return response.data
  },

  // Update application status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/applications/${id}/status`, { status })
    return response.data
  },

  // Delete application
  delete: async (id) => {
    const response = await api.delete(`/applications/${id}`)
    return response.data
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/stats/overview')
    return response.data
  },

  // Export applications (future feature)
  export: async (params = {}) => {
    const response = await api.get('/applications/export', { 
      params,
      responseType: 'blob'
    })
    return response.data
  }
}
