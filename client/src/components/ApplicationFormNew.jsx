import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { applicationSchema } from '../schemas/applicationSchema'
import { applicationService } from '../services/applicationService'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Loader2 } from 'lucide-react'

const branches = [
  'Computer Science Engineering',
  'Information Technology', 
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Other'
]

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']

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
]

export function ApplicationFormNew() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
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
      whyJoinClub: '',
      expectations: '',
    }
  })

  const createApplicationMutation = useMutation({
    mutationFn: applicationService.create,
    onSuccess: () => {
      toast.success('Application submitted successfully! 🎉')
      reset()
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Failed to submit application'
      toast.error(errorMessage)
    }
  })

  const onSubmit = (data) => {
    // Process skills
    const skillsString = data.skills
    const skillsArray = typeof skillsString === 'string' 
      ? skillsString.split(',').map(skill => skill.trim()).filter(skill => skill)
      : []

    // Process CGPA
    const processedData = {
      ...data,
      skills: skillsArray,
      cgpa: data.cgpa ? parseFloat(data.cgpa) : undefined,
      // Remove empty strings for optional URL fields
      resumeLink: data.resumeLink || undefined,
      portfolioLink: data.portfolioLink || undefined,
      githubLink: data.githubLink || undefined,
      linkedinLink: data.linkedinLink || undefined,
    }

    createApplicationMutation.mutate(processedData)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Club Recruitment Application</CardTitle>
          <CardDescription>
            Join our amazing team! Fill out the form below to apply.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    {...register('rollNumber')}
                    placeholder="Enter your roll number"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch *</Label>
                  <select
                    id="branch"
                    {...register('branch')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                  {errors.branch && (
                    <p className="text-sm text-destructive">{errors.branch.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <select
                    id="year"
                    {...register('year')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="text-sm text-destructive">{errors.year.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA</Label>
                  <Input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    {...register('cgpa')}
                    placeholder="8.5"
                  />
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Application Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role Applied For *</Label>
                  <select
                    id="role"
                    {...register('role')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    {...register('skills')}
                    placeholder="React, Node.js, Python, UI/UX"
                  />
                </div>
              </div>
            </div>

            {/* Links & Portfolio */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Links & Portfolio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resumeLink">Resume Link</Label>
                  <Input
                    id="resumeLink"
                    {...register('resumeLink')}
                    placeholder="https://drive.google.com/..."
                  />
                  {errors.resumeLink && (
                    <p className="text-sm text-destructive">{errors.resumeLink.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioLink">Portfolio Link (Optional)</Label>
                  <Input
                    id="portfolioLink"
                    {...register('portfolioLink')}
                    placeholder="https://your-portfolio.com (optional)"
                  />
                  {errors.portfolioLink && (
                    <p className="text-sm text-destructive">{errors.portfolioLink.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubLink">GitHub Profile</Label>
                  <Input
                    id="githubLink"
                    {...register('githubLink')}
                    placeholder="https://github.com/yourusername"
                  />
                  {errors.githubLink && (
                    <p className="text-sm text-destructive">{errors.githubLink.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinLink">LinkedIn Profile</Label>
                  <Input
                    id="linkedinLink"
                    {...register('linkedinLink')}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                  {errors.linkedinLink && (
                    <p className="text-sm text-destructive">{errors.linkedinLink.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Additional Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="previousExperience">Previous Experience</Label>
                <textarea
                  id="previousExperience"
                  {...register('previousExperience')}
                  rows="3"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Tell us about your previous experience, projects, internships, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whyJoinClub">Why do you want to join our club?</Label>
                <textarea
                  id="whyJoinClub"
                  {...register('whyJoinClub')}
                  rows="3"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="What motivates you to join our club?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectations">What are your expectations?</Label>
                <textarea
                  id="expectations"
                  {...register('expectations')}
                  rows="3"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="What do you hope to achieve by joining our club?"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={createApplicationMutation.isPending}
                className="w-full md:w-auto px-8"
              >
                {createApplicationMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {createApplicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
