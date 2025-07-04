import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// import QueryProvider from './providers/QueryProvider';
import './App.css';

// Components
import Navbar from './components/Navbar.js';
import LandingPage from './components/LandingPage.js';
import ApplicationForm from './components/ApplicationForm.js';
import AdminLogin from './components/admin/AdminLogin.js';
import AdminDashboard from './components/admin/AdminDashboard.js';
import ApplicationsList from './components/admin/ApplicationsList.js';
import Statistics from './components/admin/Statistics.js';
import InterviewScheduler from './components/admin/InterviewScheduler.js';

function App() {
  return (
    // <QueryProvider>
      <Router>
        <div className="min-h-screen relative overflow-hidden">
          {/* Dark Tech Background */}
          <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black"></div>
          
          {/* Animated tech patterns */}
          <div className="fixed inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-600/5"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full filter blur-3xl animate-float"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full filter blur-3xl animate-float-delayed"></div>
            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-to-r from-slate-400/10 to-blue-400/10 rounded-full filter blur-2xl animate-float-slow"></div>
          </div>

          {/* Circuit pattern overlay */}
          <div className="fixed inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0),
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px, 50px 50px, 50px 50px'
            }}></div>
          </div>

          <Navbar />
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/apply" element={<ApplicationForm />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/applications" element={<ApplicationsList />} />
              <Route path="/admin/statistics" element={<Statistics />} />
              <Route path="/admin/interviews" element={<InterviewScheduler />} />
            </Routes>
          </main>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
        </div>
      </Router>
    // </QueryProvider>
  );
}

export default App;
