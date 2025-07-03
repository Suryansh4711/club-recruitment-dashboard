import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// shadcn/ui components
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';

const ApplicationForm = () => {
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
    'UI/UX Designer',
    'Mobile App Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Content Writer',
    'Social Media Manager',
    'Event Manager',
    'Marketing Lead',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert skills string to array
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
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to submit application';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Club Recruitment Application
          </CardTitle>
          <CardDescription className="text-lg">
            Join our amazing team! Fill out the form below to apply.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <Separator className="mb-6" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter your roll number"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
                <Separator className="mb-6" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch *</Label>
                  <Select 
                    name="branch" 
                    value={formData.branch} 
                    onValueChange={(value) => handleChange({ target: { name: 'branch', value } })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Select 
                    name="year" 
                    value={formData.year} 
                    onValueChange={(value) => handleChange({ target: { name: 'year', value } })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA</Label>
                  <Input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    placeholder="8.5"
                  />
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Application Details</h2>
                <Separator className="mb-6" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Role Applied For *</Label>
                  <Select 
                    name="role" 
                    value={formData.role} 
                    onValueChange={(value) => handleChange({ target: { name: 'role', value } })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, Python, UI/UX"
                  />
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Links & Portfolio</h2>
                <Separator className="mb-6" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="resumeLink">Resume Link</Label>
                  <Input
                    id="resumeLink"
                    type="url"
                    name="resumeLink"
                    value={formData.resumeLink}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="portfolioLink">Portfolio Link (Optional)</Label>
                  <Input
                    id="portfolioLink"
                    type="url"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleChange}
                    placeholder="https://your-portfolio.com (optional)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="githubLink">GitHub Profile</Label>
                  <Input
                    id="githubLink"
                    type="url"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedinLink">LinkedIn Profile</Label>
                  <Input
                    id="linkedinLink"
                    type="url"
                    name="linkedinLink"
                    value={formData.linkedinLink}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                <Separator className="mb-6" />
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="previousExperience">Previous Experience</Label>
                  <Textarea
                    id="previousExperience"
                    name="previousExperience"
                    value={formData.previousExperience}
                    onChange={handleChange}
                    placeholder="Tell us about your previous experience, projects, internships, etc."
                    className="min-h-24"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whyJoinClub">Why do you want to join our club?</Label>
                  <Textarea
                    id="whyJoinClub"
                    name="whyJoinClub"
                    value={formData.whyJoinClub}
                    onChange={handleChange}
                    placeholder="What motivates you to join our club?"
                    className="min-h-24"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectations">What are your expectations?</Label>
                  <Textarea
                    id="expectations"
                    name="expectations"
                    value={formData.expectations}
                    onChange={handleChange}
                    placeholder="What do you hope to achieve by joining our club?"
                    className="min-h-24"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="px-8"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationForm;
