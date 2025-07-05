import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6B7280" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#9CA3AF" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#6B7280" stopOpacity="0.8"/>
            </linearGradient>
            <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.7"/>
              <stop offset="50%" stopColor="#D1D5DB" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0.7"/>
            </linearGradient>
          </defs>
          
          {/* Horizontal flowing lines */}
          <g>
            <line x1="-100%" y1="20%" x2="200%" y2="20%" stroke="url(#lineGradient1)" strokeWidth="2" opacity="0.4">
              <animate attributeName="x1" values="-100%;200%" dur="8s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="200%;500%" dur="8s" repeatCount="indefinite"/>
            </line>
            <line x1="-100%" y1="40%" x2="200%" y2="40%" stroke="url(#lineGradient2)" strokeWidth="2" opacity="0.3">
              <animate attributeName="x1" values="-100%;200%" dur="12s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="200%;500%" dur="12s" repeatCount="indefinite"/>
            </line>
            <line x1="-100%" y1="60%" x2="200%" y2="60%" stroke="url(#lineGradient1)" strokeWidth="2" opacity="0.35">
              <animate attributeName="x1" values="-100%;200%" dur="10s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="200%;500%" dur="10s" repeatCount="indefinite"/>
            </line>
            <line x1="-100%" y1="80%" x2="200%" y2="80%" stroke="url(#lineGradient2)" strokeWidth="2" opacity="0.3">
              <animate attributeName="x1" values="-100%;200%" dur="14s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="200%;500%" dur="14s" repeatCount="indefinite"/>
            </line>
          </g>
          
          {/* Vertical flowing lines */}
          <g>
            <line x1="20%" y1="-100%" x2="20%" y2="200%" stroke="url(#lineGradient1)" strokeWidth="2" opacity="0.3">
              <animate attributeName="y1" values="-100%;200%" dur="9s" repeatCount="indefinite"/>
              <animate attributeName="y2" values="200%;500%" dur="9s" repeatCount="indefinite"/>
            </line>
            <line x1="40%" y1="-100%" x2="40%" y2="200%" stroke="url(#lineGradient2)" strokeWidth="2" opacity="0.25">
              <animate attributeName="y1" values="-100%;200%" dur="11s" repeatCount="indefinite"/>
              <animate attributeName="y2" values="200%;500%" dur="11s" repeatCount="indefinite"/>
            </line>
            <line x1="60%" y1="-100%" x2="60%" y2="200%" stroke="url(#lineGradient1)" strokeWidth="2" opacity="0.35">
              <animate attributeName="y1" values="-100%;200%" dur="13s" repeatCount="indefinite"/>
              <animate attributeName="y2" values="200%;500%" dur="13s" repeatCount="indefinite"/>
            </line>
            <line x1="80%" y1="-100%" x2="80%" y2="200%" stroke="url(#lineGradient2)" strokeWidth="2" opacity="0.3">
              <animate attributeName="y1" values="-100%;200%" dur="15s" repeatCount="indefinite"/>
              <animate attributeName="y2" values="200%;500%" dur="15s" repeatCount="indefinite"/>
            </line>
          </g>
          
          {/* Diagonal flowing lines */}
          <g>
            <line x1="-50%" y1="-50%" x2="150%" y2="150%" stroke="url(#lineGradient1)" strokeWidth="1.5" opacity="0.25">
              <animate attributeName="x1" values="-50%;150%" dur="16s" repeatCount="indefinite"/>
              <animate attributeName="y1" values="-50%;150%" dur="16s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="150%;350%" dur="16s" repeatCount="indefinite"/>
              <animate attributeName="y2" values="150%;350%" dur="16s" repeatCount="indefinite"/>
            </line>
            <line x1="150%" y1="-50%" x2="-50%" y2="150%" stroke="url(#lineGradient2)" strokeWidth="1.5" opacity="0.2">
              <animate attributeName="x1" values="150%;-50%" dur="18s" repeatCount="indefinite"/>
              <animate attributeName="y1" values="-50%;150%" dur="18s" repeatCount="indefinite"/>
              <animate attributeName="x2" values="-50%;-250%" dur="18s" repeatCount="indefinite"/>
              <animate attributeName="y2" values="150%;350%" dur="18s" repeatCount="indefinite"/>
            </line>
          </g>
        </svg>
      </div>

      {/* Interactive background cursor effect */}
      <div 
        className="fixed w-96 h-96 pointer-events-none z-10 opacity-15"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: 'radial-gradient(circle, rgba(156, 163, 175, 0.4) 0%, transparent 70%)',
          transition: 'all 0.3s ease'
        }}
      />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 bg-clip-text text-transparent leading-tight">
                CodeBusters
              </h1>
              <p className="text-2xl lg:text-3xl text-gray-300 font-light">
                Tech Club - GLA University
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full mx-auto"></div>
            </div>

            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Join our student tech club at GLA University dedicated to innovation, learning, and building the future. 
              Connect with fellow students, work on exciting projects, and advance your career in technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/apply"
                className="group relative px-8 py-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-2xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-700/25"
              >
                <span className="relative z-10">Apply Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/admin/login"
                className="group relative px-8 py-4 border-2 border-gray-500/30 backdrop-blur-sm rounded-2xl text-white font-semibold text-lg transition-all duration-300 hover:border-gray-400/50 hover:bg-gray-500/10"
              >
                Admin Login
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-200 bg-clip-text text-transparent">
                  30+
                </div>
                <div className="text-gray-400 text-sm">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-300 to-gray-200 bg-clip-text text-transparent">
                  95%
                </div>
                <div className="text-gray-400 text-sm">Placement Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-300 to-gray-200 bg-clip-text text-transparent mb-4">
              Why Join CodeBusters?
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Become part of GLA University's premier technology club and accelerate your tech journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Skill Development",
                description: "Learn cutting-edge technologies, programming languages, and development frameworks",
                icon: "🚀",
                gradient: "from-gray-600 to-gray-500"
              },
              {
                title: "Peer Network",
                description: "Connect with like-minded students and build lasting friendships in tech",
                icon: "👥",
                gradient: "from-gray-500 to-gray-600"
              },
              {
                title: "Career Growth",
                description: "Build your portfolio, gain experience, and prepare for top tech companies",
                icon: "📈",
                gradient: "from-gray-600 to-gray-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative p-8 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-5 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative p-12 rounded-3xl backdrop-blur-sm border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 via-gray-500/10 to-gray-700/10 rounded-3xl"></div>
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-300 to-gray-200 bg-clip-text text-transparent mb-6">
                Ready to Join CodeBusters?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join GLA University's technology club and take your coding skills to the next level. Applications are now open for new members.
              </p>
              <Link
                to="/apply"
                className="inline-block px-12 py-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-2xl text-white font-semibold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-700/25"
              >
                Start Your Application
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-300 to-gray-200 bg-clip-text text-transparent mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions? Get in touch with the CodeBusters team
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🏫</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Location</h3>
                    <p className="text-gray-400">GLA University, Mathura, Uttar Pradesh</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Email</h3>
                    <p className="text-gray-400">code_busters@gla.ac.in</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Club Size</h3>
                    <p className="text-gray-400">30+ Active Members</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Focus Areas</h3>
                    <p className="text-gray-400">Web Development, AI/ML, Mobile Apps, Data Science</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative p-8 rounded-3xl backdrop-blur-sm border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 via-gray-500/5 to-gray-700/5 rounded-3xl"></div>
              <div className="relative space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      rows="5"
                      placeholder="Your Message"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                    ></textarea>
                  </div>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl text-white font-semibold hover:from-gray-600 hover:to-gray-500 transition-all duration-300 hover:scale-105">
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16 pt-8 border-t border-white/10"
          >
            <p className="text-gray-400">
              © 2025 CodeBusters - GLA University Technology Club. All rights reserved.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
