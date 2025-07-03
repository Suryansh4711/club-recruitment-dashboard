import { z } from 'zod'

export const applicationSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  
  // Academic Information
  branch: z.string().min(1, 'Please select your branch'),
  year: z.string().min(1, 'Please select your year'),
  rollNumber: z.string().optional(),
  cgpa: z.number().min(0).max(10).optional().or(z.string().optional()),
  
  // Application Information
  role: z.string().min(1, 'Please select a role'),
  skills: z.array(z.string()).optional(),
  
  // Links
  resumeLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  portfolioLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  githubLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedinLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  
  // Experience
  previousExperience: z.string().optional(),
  whyJoinClub: z.string().optional(),
  expectations: z.string().optional(),
})

export const adminUpdateSchema = z.object({
  status: z.enum(['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected']),
  adminNotes: z.string().optional(),
  internalRating: z.number().min(1).max(5).optional(),
  interviewDate: z.date().optional(),
  interviewTime: z.string().optional(),
  assignedTask: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    dueDate: z.date().optional(),
  }).optional(),
})
