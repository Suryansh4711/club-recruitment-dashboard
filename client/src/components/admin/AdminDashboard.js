import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchStats();
  }, []);

  const handleViewApplications = () => {
    navigate('/admin/applications');
  };

  const handleScheduleInterviews = () => {
    navigate('/admin/interviews');
  };

  const handleViewStatistics = () => {
    // Scroll to statistics section or navigate to detailed stats page
    const statsSection = document.getElementById('statistics-section');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex items-center justify-center">
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

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-xl">Manage applications, interviews, and analytics</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-6xl opacity-20"
            >
              🎛️
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
              className={`bg-black/40 backdrop-blur-sm border ${stat.border} ${stat.hover} p-6 rounded-2xl transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>
                  <motion.p 
                    className={`text-4xl font-bold text-${stat.color}-400 text-white`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div 
                  className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 10 }}
                >
                  <span className="text-3xl">{stat.icon}</span>
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
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-transparent to-gray-500/5"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-semibold text-white mb-8 flex items-center gap-3">
              <span className="text-4xl">⚡</span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { onClick: handleViewApplications, icon: "📋", title: "View All Applications", desc: "Manage and review applications", color: "blue" },
                { onClick: handleScheduleInterviews, icon: "📅", title: "Schedule Interviews", desc: "Organize interview sessions", color: "green" },
                { onClick: handleViewStatistics, icon: "📊", title: "View Statistics", desc: "Analyze detailed reports", color: "purple" }
              ].map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.onClick}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-8 border border-gray-500/30 rounded-2xl text-center hover:bg-gray-500/10 hover:border-gray-400/50 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {action.icon}
                    </motion.div>
                    <h3 className="font-bold text-white text-lg mb-2">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Statistics Section */}
        <motion.div 
          id="statistics-section" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-semibold text-white mb-8 flex items-center gap-3">
            <span className="text-4xl">📈</span>
            Detailed Statistics
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Branch Statistics */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  Applications by Branch
                </h3>
                <div className="space-y-5">
                  {stats?.branchStats?.map((branch, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 font-medium">{branch._id}</span>
                        <span className="text-white font-bold">{branch.count}</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 group-hover:from-blue-400 group-hover:to-purple-400"
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

            {/* Enhanced Role Statistics */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">💼</span>
                  Applications by Role
                </h3>
                <div className="space-y-5">
                  {stats?.roleStats?.map((role, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 font-medium">{role._id}</span>
                        <span className="text-white font-bold">{role.count}</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-1000 group-hover:from-green-400 group-hover:to-teal-400"
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
        </motion.div>

        {/* Enhanced Status Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              Application Status Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                  className="text-center p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
                >
                  <motion.div 
                    className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    {status.icon}
                  </motion.div>
                  <motion.div 
                    className={`text-3xl font-bold text-${status.color}-400 mb-2`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {status.value}
                  </motion.div>
                  <div className="text-sm text-gray-400 font-medium">{status.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
