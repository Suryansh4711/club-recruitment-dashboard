import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from './providers/QueryProvider';
import './App.css';

// Components
import Navbar from './components/Navbar';
import ApplicationForm from './components/ApplicationForm';
import AdminDashboard from './components/admin/AdminDashboard';
import ApplicationsList from './components/admin/ApplicationsList';
import Statistics from './components/admin/Statistics';
import InterviewScheduler from './components/admin/InterviewScheduler';

function App() {
  return (
    <QueryProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ApplicationForm />} />
              <Route path="/apply" element={<ApplicationForm />} />
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
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </div>
      </Router>
    </QueryProvider>
  );
}

export default App;
