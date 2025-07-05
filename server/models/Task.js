// server/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  category: {
    type: String,
    enum: ['Programming', 'Algorithm', 'Database', 'Web Development', 'System Design', 'Other'],
    default: 'Programming'
  },
  timeLimit: {
    type: Number, // in minutes
    default: 60
  },
  maxScore: {
    type: Number,
    default: 100
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: {
      type: Boolean,
      default: false
    }
  }],
  problemStatement: {
    type: String,
    required: true
  },
  constraints: {
    type: String
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
