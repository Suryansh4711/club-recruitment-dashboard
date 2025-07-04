import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// shadcn/ui components
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    year: '',
    rollNumber: '',
    cgpa: '',
    role: '',
    resumeLink: '',
    portfolioLink: '',
    githubLink: '',
    linkedinLink: '',
    previousExperience: '',
    skills: '',
    whyJoinClub: '',
    expectations: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepTitles = [
    'Personal Information',
    'Academic Details', 
    'Technical Profile',
    'Why CodeBusters?'
  ];

  const stepIcons = ['👤', '📚', '💻', '🚀'];

  const branches = [
    'Computer Science Engineering',
    'Information Technology', 
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Other'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile App Developer',
    'Data Scientist',
    'AI/ML Engineer',
    'DevOps Engineer',
    'UI/UX Designer',
    'Product Manager',
    'Other'
  ];

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return formData.branch && formData.year && formData.rollNumber;
      case 3:
        return formData.role && formData.skills;
      case 4:
        return formData.whyJoinClub;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      const submitData = {
        ...formData,
        skills: skillsArray,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : undefined
      };

      const response = await axios.post('/api/apply', submitData);
      
      toast.success('Application submitted successfully! 🎉');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        branch: '',
        year: '',
        rollNumber: '',
        cgpa: '',
        role: '',
        resumeLink: '',
        portfolioLink: '',
        githubLink: '',
        linkedinLink: '',
        previousExperience: '',
        skills: '',
        whyJoinClub: '',
        expectations: ''
      });
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepVariants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 }
    };

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200 font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200 font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-200 font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 h-12"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="branch" className="text-gray-200 font-medium">
                Branch/Department *
              </Label>
              <Select value={formData.branch} onValueChange={(value) => handleSelectChange('branch', value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white h-12">
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-gray-200 font-medium">
                Current Year *
              </Label>
              <Select value={formData.year} onValueChange={(value) => handleSelectChange('year', value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white h-12">
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNumber" className="text-gray-200 font-medium">
                Roll Number *
              </Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                type="text"
                placeholder="Enter your roll number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cgpa" className="text-gray-200 font-medium">
                CGPA/Percentage
              </Label>
              <Input
                id="cgpa"
                name="cgpa"
                type="number"
                step="0.01"
                placeholder="Enter your CGPA or percentage"
                value={formData.cgpa}
                onChange={handleChange}
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 h-12"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-200 font-medium">
                Preferred Role *
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white h-12">
                  <SelectValue placeholder="Select your preferred role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-gray-200 font-medium">
                Technical Skills *
              </Label>
              <Textarea
                id="skills"
                name="skills"
                placeholder="Enter your skills separated by commas (e.g., JavaScript, React, Python, etc.)"
                value={formData.skills}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumeLink" className="text-gray-200 font-medium">
                Resume Link
              </Label>
              <Input
                id="resumeLink"
                name="resumeLink"
                type="url"
                placeholder="https://drive.google.com/..."
                value={formData.resumeLink}
                onChange={handleChange}
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="githubLink" className="text-gray-200 font-medium">
                  GitHub Profile
                </Label>
                <Input
                  id="githubLink"
                  name="githubLink"
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinLink" className="text-gray-200 font-medium">
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedinLink"
                  name="linkedinLink"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinLink}
                  onChange={handleChange}
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousExperience" className="text-gray-200 font-medium">
                Previous Experience
              </Label>
              <Textarea
                id="previousExperience"
                name="previousExperience"
                placeholder="Tell us about your previous projects, internships, or relevant experience..."
                value={formData.previousExperience}
                onChange={handleChange}
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 min-h-[100px]"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="whyJoinClub" className="text-gray-200 font-medium">
                Why do you want to join CodeBusters? *
              </Label>
              <Textarea
                id="whyJoinClub"
                name="whyJoinClub"
                placeholder="Tell us what motivates you to join our tech community..."
                value={formData.whyJoinClub}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectations" className="text-gray-200 font-medium">
                What are your expectations from the club?
              </Label>
              <Textarea
                id="expectations"
                name="expectations"
                placeholder="What do you hope to learn and achieve as a member of CodeBusters?"
                value={formData.expectations}
                onChange={handleChange}
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50 min-h-[120px]"
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent mb-4">
            Join CodeBusters
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Apply for membership in our professional technology community and advance your career
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              
              return (
                <div key={stepNumber} className="flex items-center">
                  <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white scale-110' 
                      : isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                        : 'bg-black/40 text-gray-400 border border-blue-500/20'
                  }`}>
                    {isCompleted ? '✓' : stepIcons[index]}
                  </div>
                  {stepNumber < totalSteps && (
                    <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                      stepNumber < currentStep ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-blue-500/20'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-gray-300 text-lg font-medium">
              Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
            </p>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-black/20 border-blue-500/20 shadow-2xl shadow-black/40">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white mb-2">
                {stepTitles[currentStep - 1]}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {currentStep === 1 && "Let's start with your basic information"}
                {currentStep === 2 && "Tell us about your academic background"}
                {currentStep === 3 && "Share your technical expertise and projects"}
                {currentStep === 4 && "Finally, tell us about your motivation"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {renderStep()}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-blue-500/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-2 bg-black/20 border-blue-500/20 text-white hover:bg-black/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="px-8 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Next →
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !validateStep(currentStep)}
                      className="px-8 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        'Submit Application 🚀'
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
