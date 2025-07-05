// server/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

console.log('📋 Application routes loaded');

// POST /api/apply - Create new application
router.post('/apply', async (req, res) => {
  console.log('📝 POST /apply route hit', req.body);
  try {
    // Check if email already exists
    const existingApp = await Application.findOne({ email: req.body.email });
    if (existingApp) {
      return res.status(400).json({ error: 'Application with this email already exists' });
    }

    const newApp = new Application(req.body);
    const savedApp = await newApp.save();
    res.status(201).json({
      message: 'Application submitted successfully!',
      application: savedApp
    });
  } catch (err) {
    console.error('❌ Error saving application:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/applications - Get all applications (with filtering)
router.get('/applications', async (req, res) => {
  try {
    const { status, branch, year, role, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (branch) filter.branch = branch;
    if (year) filter.year = year;
    if (role) filter.role = role;

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    res.status(200).json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/:id - Get single application
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/applications/:id - Update application
router.put('/applications/:id', async (req, res) => {
  try {
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedApp) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.status(200).json({
      message: 'Application updated successfully',
      application: updatedApp
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/applications/:id/status - Update application status
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedApp) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // Auto-create interview slots when application is shortlisted
    if (status === 'Shortlisted') {
      await autoCreateInterviewSlots();
    }
    
    res.status(200).json({
      message: `Application status updated to ${status}`,
      application: updatedApp
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Helper function to auto-create interview slots
async function autoCreateInterviewSlots() {
  try {
    const InterviewSlot = require('../models/InterviewSlot');
    
    // Get count of shortlisted applications
    const shortlistedCount = await Application.countDocuments({ status: 'Shortlisted' });
    
    // Get existing available slots
    const availableSlots = await InterviewSlot.countDocuments({ isBooked: false });
    
    // If we have enough slots, don't create more
    if (availableSlots >= shortlistedCount) {
      return;
    }
    
    // Calculate how many more slots we need
    const slotsNeeded = shortlistedCount - availableSlots;
    const slotsPerDay = 6;
    const daysNeeded = Math.ceil(slotsNeeded / slotsPerDay);
    
    // Default time slots
    const defaultTimeSlots = [
      { start: '09:00', end: '09:30' },
      { start: '10:00', end: '10:30' },
      { start: '11:00', end: '11:30' },
      { start: '14:00', end: '14:30' },
      { start: '15:00', end: '15:30' },
      { start: '16:00', end: '16:30' }
    ];
    
    const slots = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // Start from next week
    
    let createdSlots = 0;
    let dayOffset = 0;
    
    while (createdSlots < slotsNeeded) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + dayOffset);
      
      // Skip weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        dayOffset++;
        continue;
      }
      
      for (const timeSlot of defaultTimeSlots) {
        if (createdSlots >= slotsNeeded) break;
        
        // Check if slot already exists
        const existingSlot = await InterviewSlot.findOne({
          date: currentDate,
          startTime: timeSlot.start
        });
        
        if (!existingSlot) {
          const slot = new InterviewSlot({
            date: currentDate,
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            interviewer: 'TBD'
          });
          slots.push(slot);
          createdSlots++;
        }
      }
      
      dayOffset++;
    }
    
    if (slots.length > 0) {
      await InterviewSlot.insertMany(slots);
      console.log(`✅ Auto-created ${slots.length} interview slots for shortlisted applications`);
    }
  } catch (error) {
    console.error('❌ Error auto-creating interview slots:', error);
  }
}

// DELETE /api/applications/:id - Delete application
router.delete('/applications/:id', async (req, res) => {
  try {
    const deletedApp = await Application.findByIdAndDelete(req.params.id);
    if (!deletedApp) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/stats/overview - Get dashboard statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const appliedCount = await Application.countDocuments({ status: 'Applied' });
    const shortlistedCount = await Application.countDocuments({ status: 'Shortlisted' });
    const selectedCount = await Application.countDocuments({ status: 'Selected' });
    const rejectedCount = await Application.countDocuments({ status: 'Rejected' });
    
    // Applications by branch
    const branchStats = await Application.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Applications by role
    const roleStats = await Application.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      overview: {
        total: totalApplications,
        applied: appliedCount,
        shortlisted: shortlistedCount,
        selected: selectedCount,
        rejected: rejectedCount
      },
      branchStats,
      roleStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Backward compatibility - keep the old /apply GET route
router.get('/apply', async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/export - Export applications as CSV
router.get('/applications/export', async (req, res) => {
  try {
    const { createObjectCsvWriter } = require('csv-writer');
    const path = require('path');
    
    const applications = await Application.find({})
      .sort({ createdAt: -1 });
    
    const csvWriter = createObjectCsvWriter({
      path: path.join(__dirname, '../temp/applications.csv'),
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'branch', title: 'Branch' },
        { id: 'year', title: 'Year' },
        { id: 'role', title: 'Role' },
        { id: 'status', title: 'Status' },
        { id: 'skills', title: 'Skills' },
        { id: 'previousExperience', title: 'Experience' },
        { id: 'githubLink', title: 'GitHub' },
        { id: 'linkedinLink', title: 'LinkedIn' },
        { id: 'portfolioLink', title: 'Portfolio' },
        { id: 'whyJoinClub', title: 'Why Join' },
        { id: 'createdAt', title: 'Applied Date' }
      ]
    });
    
    const records = applications.map(app => ({
      name: app.name || '',
      email: app.email || '',
      phone: app.phone || '',
      branch: app.branch || '',
      year: app.year || '',
      role: app.role || '',
      status: app.status || '',
      skills: (app.skills || []).join('; '),
      previousExperience: app.previousExperience || '',
      githubLink: app.githubLink || '',
      linkedinLink: app.linkedinLink || '',
      portfolioLink: app.portfolioLink || '',
      whyJoinClub: app.whyJoinClub || '',
      createdAt: app.createdAt ? app.createdAt.toISOString().split('T')[0] : ''
    }));
    
    await csvWriter.writeRecords(records);
    
    res.download(path.join(__dirname, '../temp/applications.csv'), 'applications.csv', (err) => {
      if (err) {
        console.error('❌ Error downloading file:', err);
        res.status(500).json({ error: 'Error downloading file' });
      }
    });
  } catch (err) {
    console.error('❌ Error exporting applications:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
