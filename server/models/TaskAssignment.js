// server/models/TaskAssignment.js
const mongoose = require('mongoose');

const taskAssignmentSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  candidateEmail: {
    type: String,
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Assigned', 'In Progress', 'Submitted', 'Evaluated', 'Overdue'],
    default: 'Assigned'
  },
  submission: {
    code: String,
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'c', 'other'],
      default: 'javascript'
    },
    submittedAt: Date,
    executionTime: Number, // in milliseconds
    memoryUsed: Number, // in MB
    testResults: [{
      testCaseId: String,
      passed: Boolean,
      output: String,
      error: String
    }]
  },
  evaluation: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    feedback: String,
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    evaluatedAt: Date,
    passingScore: {
      type: Number,
      default: 60
    }
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  notes: String
}, {
  timestamps: true
});

// Index for efficient querying
taskAssignmentSchema.index({ applicationId: 1, taskId: 1 });
taskAssignmentSchema.index({ status: 1, dueDate: 1 });

module.exports = mongoose.model('TaskAssignment', taskAssignmentSchema);
