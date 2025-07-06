// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const nodemailer = require('nodemailer');

console.log('📋 Task routes loaded');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// POST /api/tasks/assign - Assign task to applicant
router.post('/assign', async (req, res) => {
  try {
    const { applicationId, title, description, dueDate } = req.body;
    
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update application with assigned task
    application.assignedTask = {
      title,
      description,
      dueDate: new Date(dueDate),
      submissionLink: '',
      score: null,
      feedback: ''
    };

    await application.save();

    // Send email notification
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: application.email,
        subject: `CodeBusters - Task Assignment: ${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Task Assignment - CodeBusters</h2>
            <p>Hello ${application.name},</p>
            <p>We're excited to inform you that you've been assigned a task as part of the CodeBusters recruitment process.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Task Details:</h3>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Description:</strong> ${description}</p>
              <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            </div>
            
            <p>Please complete the task by the due date and submit your solution.</p>
            <p>Best of luck!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                CodeBusters Team<br>
                GLA University
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Task assignment email sent successfully');
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      // Continue even if email fails
    }

    res.status(200).json({
      message: 'Task assigned successfully',
      application
    });
  } catch (error) {
    console.error('❌ Error assigning task:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/tasks/:id/evaluate - Evaluate submitted task
router.put('/:id/evaluate', async (req, res) => {
  try {
    const { score, feedback } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (!application.assignedTask) {
      return res.status(400).json({ error: 'No task assigned to this application' });
    }

    // Update task evaluation
    application.assignedTask.score = score;
    application.assignedTask.feedback = feedback;

    await application.save();

    // Send evaluation email
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: application.email,
        subject: `CodeBusters - Task Evaluation: ${application.assignedTask.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Task Evaluation - CodeBusters</h2>
            <p>Hello ${application.name},</p>
            <p>Your submitted task has been evaluated by our team.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Evaluation Results:</h3>
              <p><strong>Task:</strong> ${application.assignedTask.title}</p>
              <p><strong>Score:</strong> ${score}/100</p>
              <p><strong>Feedback:</strong> ${feedback}</p>
            </div>
            
            <p>Thank you for your submission. We'll be in touch regarding the next steps.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                CodeBusters Team<br>
                GLA University
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Task evaluation email sent successfully');
    } catch (emailError) {
      console.error('❌ Error sending evaluation email:', emailError);
      // Continue even if email fails
    }

    res.status(200).json({
      message: 'Task evaluated successfully',
      application
    });
  } catch (error) {
    console.error('❌ Error evaluating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks/stats - Get task statistics
router.get('/stats', async (req, res) => {
  try {
    const totalTasks = await Application.countDocuments({ 
      'assignedTask.title': { $exists: true } 
    });
    
    const submittedTasks = await Application.countDocuments({ 
      'assignedTask.submissionLink': { $exists: true, $ne: '' } 
    });
    
    const evaluatedTasks = await Application.countDocuments({ 
      'assignedTask.score': { $exists: true, $ne: null } 
    });

    const averageScore = await Application.aggregate([
      { $match: { 'assignedTask.score': { $exists: true, $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: '$assignedTask.score' } } }
    ]);

    res.status(200).json({
      totalTasks,
      submittedTasks,
      evaluatedTasks,
      averageScore: averageScore[0]?.avgScore || 0
    });
  } catch (error) {
    console.error('❌ Error fetching task stats:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
