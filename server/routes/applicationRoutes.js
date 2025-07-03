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
    
    res.status(200).json({
      message: `Application status updated to ${status}`,
      application: updatedApp
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

module.exports = router;
