import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-red-400">Error loading statistics: {error}</p>
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
            Detailed Statistics
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Comprehensive analytics and insights</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-sm border border-gray-500/20 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-white">{stats?.overview?.total || 0}</div>
            <div className="text-sm text-gray-400">Total Applications</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-orange-500/20 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-orange-400">{stats?.overview?.applied || 0}</div>
            <div className="text-sm text-gray-400">Applied</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-green-400">{stats?.overview?.shortlisted || 0}</div>
            <div className="text-sm text-gray-400">Shortlisted</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-purple-400">{stats?.overview?.selected || 0}</div>
            <div className="text-sm text-gray-400">Selected</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-red-500/20 p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-red-400">{stats?.overview?.rejected || 0}</div>
            <div className="text-sm text-gray-400">Rejected</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Branch Distribution */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Applications by Branch</h2>
            <div className="space-y-4">
              {stats?.branchStats?.map((branch, index) => {
                const percentage = stats.overview.total > 0 ? (branch.count / stats.overview.total) * 100 : 0;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <span className="text-gray-300 w-24 text-sm">{branch._id}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{branch.count}</div>
                        <div className="text-gray-400 text-xs">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Distribution */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Applications by Role</h2>
            <div className="space-y-4">
              {stats?.roleStats?.map((role, index) => {
                const percentage = stats.overview.total > 0 ? (role.count / stats.overview.total) * 100 : 0;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <span className="text-gray-300 w-24 text-sm">{role._id}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{role.count}</div>
                        <div className="text-gray-400 text-xs">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Application Status Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { status: 'Applied', count: stats?.overview?.applied || 0, color: 'from-orange-500 to-red-500' },
              { status: 'Shortlisted', count: stats?.overview?.shortlisted || 0, color: 'from-green-500 to-blue-500' },
              { status: 'Selected', count: stats?.overview?.selected || 0, color: 'from-purple-500 to-pink-500' },
              { status: 'Rejected', count: stats?.overview?.rejected || 0, color: 'from-red-500 to-gray-500' }
            ].map((item, index) => {
              const percentage = stats?.overview?.total > 0 ? (item.count / stats.overview.total) * 100 : 0;
              return (
                <div key={index} className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                    <div 
                      className={`absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r ${item.color} bg-clip-border transition-all duration-500`}
                      style={{ 
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * percentage / 100 - Math.PI / 2)}% ${50 + 50 * Math.sin(2 * Math.PI * percentage / 100 - Math.PI / 2)}%, 50% 50%)` 
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{item.count}</span>
                    </div>
                  </div>
                  <div className="text-white font-medium">{item.status}</div>
                  <div className="text-gray-400 text-sm">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Selection Rate</h3>
            <div className="text-3xl font-bold text-green-400">
              {stats?.overview?.total > 0 ? ((stats.overview.selected / stats.overview.total) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-gray-400 text-sm">Of total applications</p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Shortlist Rate</h3>
            <div className="text-3xl font-bold text-blue-400">
              {stats?.overview?.total > 0 ? ((stats.overview.shortlisted / stats.overview.total) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-gray-400 text-sm">Of total applications</p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Most Popular Role</h3>
            <div className="text-3xl font-bold text-purple-400">
              {stats?.roleStats?.[0]?._id || 'N/A'}
            </div>
            <p className="text-gray-400 text-sm">{stats?.roleStats?.[0]?.count || 0} applications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
