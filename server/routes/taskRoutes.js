// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskAssignment = require('../models/TaskAssignment');
const Application = require('../models/Application');
const nodemailer = require('nodemailer');

console.log('📋 Task routes loaded');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, active } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (active !== undefined) filter.isActive = active === 'true';
    
    const tasks = await Task.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json(tasks);
  } catch (err) {
    console.error('❌ Error fetching tasks:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.body.createdBy || '507f1f77bcf86cd799439011' // Default admin ID
    });
    
    const savedTask = await task.save();
    await savedTask.populate('createdBy', 'username');
    
    res.status(201).json({
      message: 'Task created successfully',
      task: savedTask
    });
  } catch (err) {
    console.error('❌ Error creating task:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'username');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (err) {
    console.error('❌ Error fetching task:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (err) {
    console.error('❌ Error updating task:', err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Also delete related assignments
    await TaskAssignment.deleteMany({ taskId: req.params.id });
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting task:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks/assign - Assign task to candidates
router.post('/assign', async (req, res) => {
  try {
    const { taskId, applicationIds, dueDate, notes } = req.body;
    
    // Validate task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Get applications
    const applications = await Application.find({ _id: { $in: applicationIds } });
    if (applications.length !== applicationIds.length) {
      return res.status(400).json({ error: 'Some applications not found' });
    }
    
    const assignments = [];
    
    // Create assignments for each candidate
    for (const application of applications) {
      // Check if already assigned
      const existingAssignment = await TaskAssignment.findOne({
        taskId,
        applicationId: application._id
      });
      
      if (existingAssignment) {
        console.log(`Task already assigned to ${application.name}`);
        continue;
      }
      
      const assignment = new TaskAssignment({
        taskId,
        applicationId: application._id,
        candidateName: application.name,
        candidateEmail: application.email,
        assignedBy: req.body.assignedBy || '507f1f77bcf86cd799439011',
        dueDate: new Date(dueDate),
        notes
      });
      
      const savedAssignment = await assignment.save();
      assignments.push(savedAssignment);
      
      // Send email notification
      await sendTaskAssignmentEmail(application, task, savedAssignment);
    }
    
    res.status(201).json({
      message: `Task assigned to ${assignments.length} candidates`,
      assignments
    });
  } catch (err) {
    console.error('❌ Error assigning task:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/tasks/assignments - Get all task assignments
router.get('/assignments/list', async (req, res) => {
  try {
    const { status, taskId, applicationId } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (taskId) filter.taskId = taskId;
    if (applicationId) filter.applicationId = applicationId;
    
    const assignments = await TaskAssignment.find(filter)
      .populate('taskId', 'title difficulty category timeLimit maxScore')
      .populate('applicationId', 'name email role branch year')
      .sort({ assignedAt: -1 });
    
    res.status(200).json(assignments);
  } catch (err) {
    console.error('❌ Error fetching assignments:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tasks/assignments/:id - Get single assignment
router.get('/assignments/:id', async (req, res) => {
  try {
    const assignment = await TaskAssignment.findById(req.params.id)
      .populate('taskId')
      .populate('applicationId', 'name email role branch year')
      .populate('assignedBy', 'username')
      .populate('evaluation.evaluatedBy', 'username');
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.status(200).json(assignment);
  } catch (err) {
    console.error('❌ Error fetching assignment:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tasks/assignments/:id/submit - Submit task solution
router.put('/assignments/:id/submit', async (req, res) => {
  try {
    const { code, language } = req.body;
    const assignmentId = req.params.id;
    
    const assignment = await TaskAssignment.findById(assignmentId)
      .populate('taskId');
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    // Check if already submitted
    if (assignment.status === 'Submitted' || assignment.status === 'Evaluated') {
      return res.status(400).json({ error: 'Assignment already submitted' });
    }
    
    // Check if overdue
    if (new Date() > assignment.dueDate) {
      assignment.status = 'Overdue';
      await assignment.save();
      return res.status(400).json({ error: 'Assignment is overdue' });
    }
    
    // Update submission
    assignment.submission = {
      code,
      language,
      submittedAt: new Date(),
      testResults: [] // Will be populated by code execution
    };
    assignment.status = 'Submitted';
    assignment.attempts += 1;
    
    await assignment.save();
    
    // TODO: Execute code against test cases
    await executeCodeAgainstTestCases(assignment);
    
    res.status(200).json({
      message: 'Task submitted successfully',
      assignment
    });
  } catch (err) {
    console.error('❌ Error submitting task:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/tasks/assignments/:id/evaluate - Evaluate assignment
router.put('/assignments/:id/evaluate', async (req, res) => {
  try {
    const { score, feedback, evaluatedBy } = req.body;
    const assignmentId = req.params.id;
    
    const assignment = await TaskAssignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    if (assignment.status !== 'Submitted') {
      return res.status(400).json({ error: 'Assignment not submitted yet' });
    }
    
    assignment.evaluation = {
      score,
      feedback,
      evaluatedBy,
      evaluatedAt: new Date()
    };
    assignment.status = 'Evaluated';
    
    await assignment.save();
    
    // Send evaluation email
    await sendEvaluationEmail(assignment);
    
    res.status(200).json({
      message: 'Assignment evaluated successfully',
      assignment
    });
  } catch (err) {
    console.error('❌ Error evaluating assignment:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/tasks/assignments/stats - Get assignment statistics
router.get('/assignments/stats', async (req, res) => {
  try {
    const totalAssignments = await TaskAssignment.countDocuments();
    const submitted = await TaskAssignment.countDocuments({ status: 'Submitted' });
    const evaluated = await TaskAssignment.countDocuments({ status: 'Evaluated' });
    const overdue = await TaskAssignment.countDocuments({ status: 'Overdue' });
    const pending = await TaskAssignment.countDocuments({ status: 'Assigned' });
    
    // Task performance stats
    const taskStats = await TaskAssignment.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: 'taskId',
          foreignField: '_id',
          as: 'task'
        }
      },
      {
        $unwind: '$task'
      },
      {
        $group: {
          _id: '$task.title',
          totalAssignments: { $sum: 1 },
          submittedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Submitted'] }, 1, 0]
            }
          },
          averageScore: {
            $avg: '$evaluation.score'
          }
        }
      }
    ]);
    
    res.status(200).json({
      overview: {
        total: totalAssignments,
        submitted,
        evaluated,
        overdue,
        pending
      },
      taskStats
    });
  } catch (err) {
    console.error('❌ Error fetching assignment stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Helper function to send task assignment email
async function sendTaskAssignmentEmail(application, task, assignment) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.email,
      subject: `Task Assignment - ${task.title} | CodeBusters Club`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Task Assignment!</h2>
          <p>Dear ${application.name},</p>
          <p>You have been assigned a new task as part of the CodeBusters Club recruitment process.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Task Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Title:</strong> ${task.title}</li>
              <li><strong>Difficulty:</strong> ${task.difficulty}</li>
              <li><strong>Category:</strong> ${task.category}</li>
              <li><strong>Time Limit:</strong> ${task.timeLimit} minutes</li>
              <li><strong>Due Date:</strong> ${new Date(assignment.dueDate).toLocaleDateString()}</li>
              <li><strong>Max Score:</strong> ${task.maxScore} points</li>
            </ul>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">Instructions:</h4>
            <ol style="color: #92400e;">
              <li>Read the problem statement carefully</li>
              <li>Write your solution in your preferred programming language</li>
              <li>Test your solution with the provided examples</li>
              <li>Submit your solution before the due date</li>
            </ol>
          </div>
          
          <p>Access the task portal through the recruitment dashboard or contact us if you need assistance.</p>
          
          <p>Best of luck!</p>
          <p>CodeBusters Club Team</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Task assignment email sent to:', application.email);
  } catch (error) {
    console.error('❌ Error sending task assignment email:', error);
  }
}

// Helper function to send evaluation email
async function sendEvaluationEmail(assignment) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: assignment.candidateEmail,
      subject: `Task Evaluation - ${assignment.taskId.title} | CodeBusters Club`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Task Evaluation Complete!</h2>
          <p>Dear ${assignment.candidateName},</p>
          <p>Your submitted task has been evaluated. Here are the results:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Evaluation Results:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Score:</strong> ${assignment.evaluation.score}/100</li>
              <li><strong>Status:</strong> ${assignment.evaluation.score >= 60 ? 'Passed' : 'Needs Improvement'}</li>
              <li><strong>Evaluated On:</strong> ${new Date(assignment.evaluation.evaluatedAt).toLocaleDateString()}</li>
            </ul>
          </div>
          
          ${assignment.evaluation.feedback ? `
            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #065f46; margin-top: 0;">Feedback:</h4>
              <p style="color: #065f46;">${assignment.evaluation.feedback}</p>
            </div>
          ` : ''}
          
          <p>Thank you for your submission. We'll be in touch regarding the next steps.</p>
          
          <p>Best regards,<br>CodeBusters Club Team</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Evaluation email sent to:', assignment.candidateEmail);
  } catch (error) {
    console.error('❌ Error sending evaluation email:', error);
  }
}

// Helper function to execute code against test cases (placeholder)
async function executeCodeAgainstTestCases(assignment) {
  // This is a placeholder for code execution
  // In a real implementation, you would use a code execution service
  console.log('🔍 Executing code against test cases...');
  
  // Simulate test execution
  const testResults = assignment.taskId.testCases.map((testCase, index) => ({
    testCaseId: index.toString(),
    passed: Math.random() > 0.3, // 70% pass rate for simulation
    output: 'Sample output',
    error: null
  }));
  
  assignment.submission.testResults = testResults;
  await assignment.save();
  
  console.log('✅ Test execution completed');
}

module.exports = router;
