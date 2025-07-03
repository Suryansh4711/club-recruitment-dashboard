// server/models/InterviewSlot.js
const mongoose = require('mongoose');

const interviewSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // "09:00"
  endTime: { type: String, required: true }, // "09:30"
  isBooked: { type: Boolean, default: false },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  interviewer: { type: String },
  meetingLink: { type: String },
  notes: { type: String }
}, {
  timestamps: true
});

// Compound index to ensure unique time slots
interviewSlotSchema.index({ date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('InterviewSlot', interviewSlotSchema);
