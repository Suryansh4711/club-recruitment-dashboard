import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

// shadcn/ui components (adjust import paths as needed)
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    clubId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the actual backend API for authentication
      const response = await adminService.login(credentials);
      
      if (response.token) {
        // Store admin auth in localStorage
        localStorage.setItem('adminAuth', JSON.stringify({
          clubId: credentials.clubId,
          role: response.admin.role,
          loginTime: new Date().toISOString()
        }));
        
        // Store token for API requests
        localStorage.setItem('token', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.admin));
        
        toast.success('Login successful! Welcome to CodeBusters Admin Panel');
        navigate('/admin');
      } else {
        toast.error('Invalid club ID or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid club ID or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
      {/* Enhanced Background with Animated Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>
      
      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-600/15 to-gray-500/15 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-gray-400/10 to-gray-500/10 rounded-full filter blur-2xl animate-pulse delay-2000"></div>
        
        {/* Subtle Lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-gray-500 to-transparent"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Enhanced Card with Glass Effect */}
          <Card className="backdrop-blur-xl bg-black/30 border-gray-500/30 shadow-2xl shadow-black/50 relative overflow-hidden">
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-transparent to-gray-500/5 rounded-2xl"></div>
            
            <CardHeader className="text-center pb-8 relative">
              {/* Enhanced Icon with Better Animation */}
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-6"
              >
                <div className="relative">
                  {/* Outer Glow Ring */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-gray-400/20 via-gray-500/20 to-gray-400/20 rounded-3xl blur-lg animate-pulse"></div>
                  
                  {/* Main Icon Container */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-gray-700/80 via-gray-600/80 to-gray-700/80 rounded-2xl backdrop-blur-sm border border-gray-400/30 flex items-center justify-center group">
                    {/* Inner Highlight */}
                    <div className="absolute inset-1 bg-gradient-to-br from-gray-500/20 to-transparent rounded-xl"></div>
                    
                    {/* Lock Icon with Animation */}
                    <motion.span 
                      className="text-white font-bold text-2xl relative z-10 group-hover:scale-110 transition-transform duration-300"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      🔐
                    </motion.span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent mb-2">
                  Admin Access
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Enter your club credentials to access the admin dashboard
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Enhanced Form Fields */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="clubId" className="text-gray-200 font-medium flex items-center gap-2">
                    <span className="text-sm">👤</span>
                    Club ID
                  </Label>
                  <div className="relative">
                    <Input
                      id="clubId"
                      name="clubId"
                      type="text"
                      placeholder="Enter your club ID"
                      value={credentials.clubId}
                      onChange={handleInputChange}
                      required
                      className="bg-black/30 border-gray-500/30 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400/50 h-12 text-lg pl-4 pr-12 rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-gray-400/50"
                    />
                    {/* Input Icon */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-gray-200 font-medium flex items-center gap-2">
                    <span className="text-sm">🔑</span>
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                      className="bg-black/30 border-gray-500/30 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-gray-400/50 h-12 text-lg pl-4 pr-12 rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-gray-400/50"
                    />
                    {/* Input Icon */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                  >
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
                    
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>Access Admin Panel</span>
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          →
                        </motion.span>
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Footer with Version Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-6 text-center text-gray-400 text-sm"
        >
          <p className="flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>Secured by CodeBusters Admin System</span>
            <span>•</span>
            <span>v2.0</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;