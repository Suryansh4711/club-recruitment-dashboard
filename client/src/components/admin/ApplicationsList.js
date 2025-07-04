import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    branch: '',
    role: '',
    year: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showDetails, setShowDetails] = useState(null);

  const statusColors = {
    'Applied': 'bg-blue-500',
    'Shortlisted': 'bg-green-500',
    'Selected': 'bg-purple-500',
    'Rejected': 'bg-red-500'
  };

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await adminService.getApplications(filters);
      setApplications(data.applications);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await adminService.updateApplicationStatus(applicationId, newStatus);
      await fetchApplications(); // Refresh the list
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update application status');
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedApplications.length === 0) {
      alert('Please select applications to update');
      return;
    }

    try {
      await adminService.bulkUpdateStatus(selectedApplications, status);
      setSelectedApplications([]);
      await fetchApplications();
    } catch (err) {
      console.error('Error bulk updating status:', err);
      alert('Failed to update application statuses');
    }
  };

  const handleSelectApplication = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map(app => app._id));
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await adminService.deleteApplication(applicationId);
        await fetchApplications();
      } catch (err) {
        console.error('Error deleting application:', err);
        alert('Failed to delete application');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-red-400">Error loading applications: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            Applications Management
          </h1>
          <p className="text-gray-400 mt-2 text-lg">View, filter, and manage all applications</p>
        </div>

        {/* Filters */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-400"
              >
                <option value="">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Branch</label>
              <select 
                value={filters.branch} 
                onChange={(e) => handleFilterChange('branch', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-400"
              >
                <option value="">All Branches</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
              <select 
                value={filters.role} 
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-400"
              >
                <option value="">All Roles</option>
                <option value="Technical">Technical</option>
                <option value="Design">Design</option>
                <option value="Content">Content</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Year</label>
              <select 
                value={filters.year} 
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-400"
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedApplications.length > 0 && (
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                {selectedApplications.length} application(s) selected
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleBulkStatusUpdate('Shortlisted')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Shortlist
                </button>
                <button 
                  onClick={() => handleBulkStatusUpdate('Selected')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Select
                </button>
                <button 
                  onClick={() => handleBulkStatusUpdate('Rejected')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applications Table */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="p-4 text-left">
                    <input 
                      type="checkbox" 
                      checked={applications.length > 0 && selectedApplications.length === applications.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">Name</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Email</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Branch</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Year</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Role</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Status</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Applied</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-t border-gray-700 hover:bg-gray-800/30">
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={selectedApplications.includes(app._id)}
                        onChange={() => handleSelectApplication(app._id)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4 text-white font-medium">{app.name}</td>
                    <td className="p-4 text-gray-300">{app.email}</td>
                    <td className="p-4 text-gray-300">{app.branch}</td>
                    <td className="p-4 text-gray-300">{app.year}</td>
                    <td className="p-4 text-gray-300">{app.role}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[app.status] || 'bg-gray-500'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{formatDate(app.createdAt)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowDetails(app)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
                        >
                          View
                        </button>
                        <select 
                          value={app.status} 
                          onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                          className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteApplication(app._id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-gray-400">
              Showing {applications.length} applications
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-gray-300">
                Page {filters.page} of {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Application Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Application Details</h3>
                <button 
                  onClick={() => setShowDetails(null)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Name</label>
                    <p className="text-white">{showDetails.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Email</label>
                    <p className="text-white">{showDetails.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Phone</label>
                    <p className="text-white">{showDetails.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Roll Number</label>
                    <p className="text-white">{showDetails.rollNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Branch</label>
                    <p className="text-white">{showDetails.branch}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Year</label>
                    <p className="text-white">{showDetails.year}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Role</label>
                    <p className="text-white">{showDetails.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Status</label>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[showDetails.status] || 'bg-gray-500'}`}>
                      {showDetails.status}
                    </span>
                  </div>
                </div>
                
                {showDetails.githubProfile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400">GitHub Profile</label>
                    <a href={showDetails.githubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      {showDetails.githubProfile}
                    </a>
                  </div>
                )}
                
                {showDetails.linkedinProfile && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400">LinkedIn Profile</label>
                    <a href={showDetails.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      {showDetails.linkedinProfile}
                    </a>
                  </div>
                )}
                
                {showDetails.skills && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Skills</label>
                    <p className="text-white">{showDetails.skills}</p>
                  </div>
                )}
                
                {showDetails.experience && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Experience</label>
                    <p className="text-white">{showDetails.experience}</p>
                  </div>
                )}
                
                {showDetails.motivation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Motivation</label>
                    <p className="text-white">{showDetails.motivation}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-400">Applied On</label>
                  <p className="text-white">{formatDate(showDetails.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
