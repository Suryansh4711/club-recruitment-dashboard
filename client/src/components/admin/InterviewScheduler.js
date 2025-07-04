import React from 'react';

const InterviewScheduler = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Interview Scheduler
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Schedule and manage interviews</p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-400 text-lg mb-4">Interview scheduler component will be implemented here.</p>
            <p className="text-sm text-gray-500">Features: Calendar view, time slots, notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;
