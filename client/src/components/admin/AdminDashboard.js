import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'applications', 'statistics'
  const navigate = useNavigate();

  const statusColors = {
    'Applied': 'bg-blue-500',
    'Shortlisted': 'bg-green-500',
    'Selected': 'bg-purple-500',
    'Rejected': 'bg-red-500'
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [filters, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await adminService.getApplications(filters);
      setApplications(data.applications);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching applications:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await adminService.updateApplicationStatus(applicationId, newStatus);
      await fetchApplications();
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

  const handleScheduleInterviews = () => {
    navigate('/admin/interviews');
  };

  const handleLogout = () => {
    // Clear any stored auth tokens
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    // Navigate to login
    navigate('/admin/login');
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex items-center justify-center pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-gray-300 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 blur-xl"></div>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Loading dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex items-center justify-center pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-red-500 text-6xl mb-6"
          >
            ⚠️
          </motion.div>
          <h3 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-red-400 mb-6">Error loading dashboard: {error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-300 font-medium"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-600/15 to-gray-500/15 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-6 sm:pb-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-base sm:text-lg lg:text-xl">Manage applications, interviews, and analytics</p>
            </div>
            <div className="flex items-center justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-4xl sm:text-5xl lg:text-6xl opacity-20"
              >
                🎛️
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-wrap gap-1 sm:gap-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-1 sm:p-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'applications', label: 'Applications', icon: '📋' },
              { id: 'statistics', label: 'Statistics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-lg sm:text-xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Enhanced Stats Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              {[
                { label: "Total Applications", value: stats?.overview?.total || 0, icon: "📋", color: "gray", bg: "bg-gray-500/20", border: "border-gray-500/20", hover: "hover:border-gray-400/40" },
                { label: "Shortlisted", value: stats?.overview?.shortlisted || 0, icon: "✅", color: "green", bg: "bg-green-500/20", border: "border-green-500/20", hover: "hover:border-green-400/40" },
                { label: "Applied", value: stats?.overview?.applied || 0, icon: "📄", color: "orange", bg: "bg-orange-500/20", border: "border-orange-500/20", hover: "hover:border-orange-400/40" },
                { label: "Selected", value: stats?.overview?.selected || 0, icon: "🎉", color: "purple", bg: "bg-purple-500/20", border: "border-purple-500/20", hover: "hover:border-purple-400/40" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`bg-black/40 backdrop-blur-sm border ${stat.border} ${stat.hover} p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 group relative overflow-hidden`}
                >
                  <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl`}></div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1 truncate">{stat.label}</p>
                      <motion.p 
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div 
                      className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${stat.bg} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                      whileHover={{ rotate: 10 }}
                    >
                      <span className="text-xl sm:text-2xl lg:text-3xl">{stat.icon}</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-transparent to-gray-500/5"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl lg:text-4xl">⚡</span>
                  <span className="text-lg sm:text-2xl lg:text-3xl">Quick Actions</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { onClick: () => setActiveTab('applications'), icon: "📋", title: "Manage Applications", desc: "View and manage applications", color: "blue" },
                    { onClick: handleScheduleInterviews, icon: "📅", title: "Schedule Interviews", desc: "Organize interview sessions", color: "green" },
                    { onClick: () => setActiveTab('statistics'), icon: "📊", title: "View Statistics", desc: "Analyze detailed reports", color: "purple" }
                  ].map((action, index) => (
                    <motion.button
                      key={index}
                      onClick={action.onClick}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 sm:p-6 lg:p-8 border border-gray-500/30 rounded-xl sm:rounded-2xl text-center hover:bg-gray-500/10 hover:border-gray-400/50 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10">
                        <motion.div 
                          className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 group-hover:scale-125 transition-transform duration-300"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          {action.icon}
                        </motion.div>
                        <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">{action.title}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{action.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'applications' && (
          <ApplicationsManagement
            applications={applications}
            loading={loading}
            filters={filters}
            totalPages={totalPages}
            selectedApplications={selectedApplications}
            showDetails={showDetails}
            statusColors={statusColors}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onStatusUpdate={handleStatusUpdate}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onSelectApplication={handleSelectApplication}
            onSelectAll={handleSelectAll}
            onDeleteApplication={handleDeleteApplication}
            onShowDetails={setShowDetails}
          />
        )}

        {activeTab === 'statistics' && (
          <StatisticsView stats={stats} />
        )}
      </div>
    </div>
  );
};

// Applications Management Component
const ApplicationsManagement = ({ 
  applications, 
  loading, 
  filters, 
  totalPages, 
  selectedApplications, 
  showDetails, 
  statusColors,
  onFilterChange,
  onPageChange,
  onStatusUpdate,
  onBulkStatusUpdate,
  onSelectApplication,
  onSelectAll,
  onDeleteApplication,
  onShowDetails
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Filters */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🔍</span>
          <span className="text-base sm:text-lg lg:text-xl">Filters</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            value={filters.branch}
            onChange={(e) => onFilterChange('branch', e.target.value)}
            className="px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
          >
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            <option value="ME">ME</option>
          </select>
          <select
            value={filters.role}
            onChange={(e) => onFilterChange('role', e.target.value)}
            className="px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
          >
            <option value="">All Roles</option>
            <option value="Core Team">Core Team</option>
            <option value="Executive">Executive</option>
            <option value="Member">Member</option>
          </select>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange('year', e.target.value)}
            className="px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">⚡</span>
          <span className="text-base sm:text-lg lg:text-xl">Bulk Actions</span>
        </h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={onSelectAll}
            className="px-3 sm:px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-lg sm:rounded-xl text-white transition-all duration-300 text-sm sm:text-base"
          >
            {selectedApplications.length === applications.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={() => onBulkStatusUpdate('Shortlisted')}
            className="px-3 sm:px-4 py-2 bg-green-600/50 hover:bg-green-500/50 border border-green-500/50 rounded-lg sm:rounded-xl text-white transition-all duration-300 text-sm sm:text-base"
          >
            Shortlist Selected
          </button>
          <button
            onClick={() => onBulkStatusUpdate('Selected')}
            className="px-3 sm:px-4 py-2 bg-purple-600/50 hover:bg-purple-500/50 border border-purple-500/50 rounded-lg sm:rounded-xl text-white transition-all duration-300 text-sm sm:text-base"
          >
            Select Applications
          </button>
          <button
            onClick={() => onBulkStatusUpdate('Rejected')}
            className="px-3 sm:px-4 py-2 bg-red-600/50 hover:bg-red-500/50 border border-red-500/50 rounded-lg sm:rounded-xl text-white transition-all duration-300 text-sm sm:text-base"
          >
            Reject Selected
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">📋</span>
          <span className="text-base sm:text-lg lg:text-xl">Applications ({applications.length})</span>
        </h3>
        
        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-4 border-gray-600 border-t-gray-300 mx-auto"></div>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
            No applications found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:-mx-6">
            <div className="inline-block min-w-full px-4 sm:px-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 text-sm sm:text-base">
                      <input
                        type="checkbox"
                        checked={selectedApplications.length === applications.length}
                        onChange={onSelectAll}
                        className="rounded bg-gray-800 border-gray-600 w-4 h-4"
                      />
                    </th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 text-sm sm:text-base">Name</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 text-sm sm:text-base hidden sm:table-cell">Branch</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 text-sm sm:text-base hidden md:table-cell">Year</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 text-sm sm:text-base hidden lg:table-cell">Role</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 text-sm sm:text-base">Status</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 text-sm sm:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <motion.tr
                      key={app._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-all duration-300"
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(app._id)}
                          onChange={() => onSelectApplication(app._id)}
                          className="rounded bg-gray-800 border-gray-600 w-4 h-4"
                        />
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-white font-medium text-sm sm:text-base">{app.name}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base hidden sm:table-cell">{app.branch}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base hidden md:table-cell">{app.year}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base hidden lg:table-cell">{app.role}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[app.status] || 'bg-gray-500'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={() => onShowDetails(app)}
                            className="px-2 sm:px-3 py-1 bg-blue-600/50 hover:bg-blue-500/50 rounded-lg text-xs text-white transition-all duration-300"
                          >
                            View
                          </button>
                          <select
                            value={app.status}
                            onChange={(e) => onStatusUpdate(app._id, e.target.value)}
                            className="px-1 sm:px-2 py-1 bg-gray-800/50 border border-gray-600/50 rounded text-xs text-white focus:outline-none"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <button
                            onClick={() => onDeleteApplication(app._id)}
                            className="px-2 sm:px-3 py-1 bg-red-600/50 hover:bg-red-500/50 rounded-lg text-xs text-white transition-all duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                  filters.page === page
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => onShowDetails(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Application Details</h2>
              <button
                onClick={() => onShowDetails(null)}
                className="text-gray-400 hover:text-white transition-colors text-xl sm:text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Name</label>
                  <p className="text-white font-medium">{showDetails.name}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-white font-medium break-all">{showDetails.email}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Branch</label>
                  <p className="text-white font-medium">{showDetails.branch}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Year</label>
                  <p className="text-white font-medium">{showDetails.year}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Role</label>
                  <p className="text-white font-medium">{showDetails.role}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[showDetails.status] || 'bg-gray-500'}`}>
                    {showDetails.status}
                  </span>
                </div>
              </div>
              
              {showDetails.phone && (
                <div>
                  <label className="text-gray-400 text-sm">Phone</label>
                  <p className="text-white font-medium">{showDetails.phone}</p>
                </div>
              )}
              
              {showDetails.experience && (
                <div>
                  <label className="text-gray-400 text-sm">Experience</label>
                  <p className="text-white font-medium">{showDetails.experience}</p>
                </div>
              )}
              
              {showDetails.skills && (
                <div>
                  <label className="text-gray-400 text-sm">Skills</label>
                  <p className="text-white font-medium">{showDetails.skills}</p>
                </div>
              )}
              
              {showDetails.whyJoin && (
                <div>
                  <label className="text-gray-400 text-sm">Why Join?</label>
                  <p className="text-white font-medium">{showDetails.whyJoin}</p>
                </div>
              )}
              
              {showDetails.projects && (
                <div>
                  <label className="text-gray-400 text-sm">Projects</label>
                  <p className="text-white font-medium">{showDetails.projects}</p>
                </div>
              )}
              
              <div>
                <label className="text-gray-400 text-sm">Applied On</label>
                <p className="text-white font-medium">
                  {new Date(showDetails.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Statistics View Component
const StatisticsView = ({ stats }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Branch Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
          
          <div className="relative z-10">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🎓</span>
              <span className="text-base sm:text-lg lg:text-xl">Applications by Branch</span>
            </h3>
            <div className="space-y-4 sm:space-y-5">
              {stats?.branchStats?.map((branch, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 font-medium text-sm sm:text-base">{branch._id}</span>
                    <span className="text-white font-bold text-sm sm:text-base">{branch.count}</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-700/50 rounded-full h-2 sm:h-3 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all duration-1000 group-hover:from-blue-400 group-hover:to-purple-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(branch.count / stats.overview.total) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Role Statistics */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
          
          <div className="relative z-10">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">💼</span>
              <span className="text-base sm:text-lg lg:text-xl">Applications by Role</span>
            </h3>
            <div className="space-y-4 sm:space-y-5">
              {stats?.roleStats?.map((role, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 font-medium text-sm sm:text-base">{role._id}</span>
                    <span className="text-white font-bold text-sm sm:text-base">{role.count}</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-700/50 rounded-full h-2 sm:h-3 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-green-500 to-teal-500 h-2 sm:h-3 rounded-full transition-all duration-1000 group-hover:from-green-400 group-hover:to-teal-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(role.count / stats.overview.total) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"></div>
        
        <div className="relative z-10">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">📊</span>
            <span className="text-lg sm:text-xl lg:text-2xl">Application Status Overview</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Applied", value: stats?.overview?.applied || 0, color: "orange", icon: "📄" },
              { label: "Shortlisted", value: stats?.overview?.shortlisted || 0, color: "green", icon: "✅" },
              { label: "Selected", value: stats?.overview?.selected || 0, color: "purple", icon: "🎉" },
              { label: "Rejected", value: stats?.overview?.rejected || 0, color: "red", icon: "❌" }
            ].map((status, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
              >
                <motion.div 
                  className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-125 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                >
                  {status.icon}
                </motion.div>
                <motion.div 
                  className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {status.value}
                </motion.div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium">{status.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
