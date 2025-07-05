// server/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  
  // Academic Info
  branch: { type: String, required: true },
  year: { type: String, required: true },
  rollNumber: { type: String },
  cgpa: { type: Number },
  
  // Application Info
  role: { type: String, required: true },
  resumeLink: { type: String },
  portfolioLink: { type: String },
  githubLink: { type: String },
  linkedinLink: { type: String },
  
  // Experience & Skills
  previousExperience: { type: String },
  skills: [{ type: String }],
  whyJoinClub: { type: String },
  expectations: { type: String },
  
  // Status Management
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
    default: 'Applied',
  },
  
  // Interview Details
  interviewDate: { type: Date },
  interviewTime: { type: String },
  interviewLink: { type: String },
  interviewer: { type: String },
  interviewSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSlot' },
  
  // Task Assignment
  assignedTask: {
    title: { type: String },
    description: { type: String },
    dueDate: { type: Date },
    submissionLink: { type: String },
    score: { type: Number },
    feedback: { type: String }
  },
  
  // Admin Notes
  adminNotes: { type: String },
  internalRating: { type: Number, min: 1, max: 5 },
  
}, {
  timestamps: true
});

// Add indexes for efficient searching
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ branch: 1 });
applicationSchema.index({ year: 1 });
applicationSchema.index({ role: 1 });

module.exports = mongoose.model('Application', applicationSchema);
