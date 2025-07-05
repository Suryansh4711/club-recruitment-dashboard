// server/routes/interviewRoutes.js
const express = require('express');
const router = express.Router();
const InterviewSlot = require('../models/InterviewSlot');
const Application = require('../models/Application');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

console.log('📅 Interview routes loaded');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Google Calendar configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set API key as fallback
if (process.env.GOOGLE_API_KEY) {
  oauth2Client.setCredentials({
    access_token: process.env.GOOGLE_API_KEY
  });
}

if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
}

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// GET /api/interview/slots - Get all interview slots
router.get('/slots', async (req, res) => {
  try {
    const { date, available } = req.query;
    
    const filter = {};
    if (date) filter.date = new Date(date);
    if (available === 'true') filter.isBooked = false;
    
    const slots = await InterviewSlot.find(filter)
      .populate('applicationId', 'name email role')
      .sort({ date: 1, startTime: 1 });
    
    res.status(200).json(slots);
  } catch (err) {
    console.error('❌ Error fetching interview slots:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/interview/slots - Create interview slots
router.post('/slots', async (req, res) => {
  try {
    const { startDate, endDate, timeSlots } = req.body;
    
    const slots = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      // Skip weekends
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        for (const timeSlot of timeSlots) {
          const slot = new InterviewSlot({
            date: new Date(current),
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            interviewer: timeSlot.interviewer || 'TBD'
          });
          slots.push(slot);
        }
      }
      current.setDate(current.getDate() + 1);
    }
    
    const savedSlots = await InterviewSlot.insertMany(slots);
    res.status(201).json({
      message: `${savedSlots.length} interview slots created`,
      slots: savedSlots
    });
  } catch (err) {
    console.error('❌ Error creating interview slots:', err);
    res.status(400).json({ error: err.message });
  }
});

// POST /api/interview/auto-create-slots - Auto-create slots based on shortlisted applications
router.post('/auto-create-slots', async (req, res) => {
  try {
    const { daysAhead = 7, slotsPerDay = 6 } = req.body;
    
    // Get count of shortlisted applications
    const shortlistedCount = await Application.countDocuments({ status: 'Shortlisted' });
    
    if (shortlistedCount === 0) {
      return res.status(400).json({ error: 'No shortlisted applications found' });
    }
    
    // Calculate how many days we need
    const daysNeeded = Math.ceil(shortlistedCount / slotsPerDay);
    
    // Default time slots (30-minute intervals)
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
    startDate.setDate(startDate.getDate() + daysAhead); // Start from next week
    
    for (let day = 0; day < daysNeeded; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      
      // Skip weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }
      
      for (const timeSlot of defaultTimeSlots) {
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
        }
      }
    }
    
    if (slots.length > 0) {
      const savedSlots = await InterviewSlot.insertMany(slots);
      res.status(201).json({
        message: `${savedSlots.length} interview slots created automatically`,
        slots: savedSlots,
        shortlistedCount
      });
    } else {
      res.status(200).json({
        message: 'Sufficient slots already exist',
        shortlistedCount
      });
    }
  } catch (err) {
    console.error('❌ Error auto-creating slots:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/interview/assign - Auto-assign interviews to shortlisted candidates
router.post('/assign', async (req, res) => {
  try {
    // Get all shortlisted applications
    const shortlistedApps = await Application.find({ status: 'Shortlisted' });
    
    if (shortlistedApps.length === 0) {
      return res.status(400).json({ error: 'No shortlisted applications found' });
    }
    
    // Get available slots
    const availableSlots = await InterviewSlot.find({ isBooked: false })
      .sort({ date: 1, startTime: 1 });
    
    if (availableSlots.length < shortlistedApps.length) {
      return res.status(400).json({ 
        error: `Not enough slots available. Need ${shortlistedApps.length}, have ${availableSlots.length}` 
      });
    }
    
    const assignments = [];
    
    // Assign slots to applications
    for (let i = 0; i < shortlistedApps.length; i++) {
      const app = shortlistedApps[i];
      const slot = availableSlots[i];
      
      // Update slot
      slot.isBooked = true;
      slot.applicationId = app._id;
      await slot.save();
      
      // Update application status
      app.status = 'Interview Scheduled';
      app.interviewSlot = slot._id;
      await app.save();
      
      assignments.push({
        application: app,
        slot: slot
      });
      
      // Send email notification
      await sendInterviewNotification(app, slot);
      
      // Create Google Calendar event
      await createGoogleCalendarEvent(app, slot);
    }
    
    res.status(200).json({
      message: `${assignments.length} interviews scheduled successfully`,
      assignments
    });
  } catch (err) {
    console.error('❌ Error assigning interviews:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/interview/reschedule/:id - Reschedule interview
router.post('/reschedule/:id', async (req, res) => {
  try {
    const { newSlotId } = req.body;
    const applicationId = req.params.id;
    
    // Find current slot
    const currentSlot = await InterviewSlot.findOne({ applicationId });
    if (!currentSlot) {
      return res.status(404).json({ error: 'No interview scheduled for this application' });
    }
    
    // Find new slot
    const newSlot = await InterviewSlot.findById(newSlotId);
    if (!newSlot || newSlot.isBooked) {
      return res.status(400).json({ error: 'Selected slot is not available' });
    }
    
    // Update slots
    currentSlot.isBooked = false;
    currentSlot.applicationId = null;
    await currentSlot.save();
    
    newSlot.isBooked = true;
    newSlot.applicationId = applicationId;
    await newSlot.save();
    
    // Update application
    const application = await Application.findById(applicationId);
    application.interviewSlot = newSlot._id;
    await application.save();
    
    // Send notification
    await sendInterviewNotification(application, newSlot);
    
    res.status(200).json({
      message: 'Interview rescheduled successfully',
      slot: newSlot
    });
  } catch (err) {
    console.error('❌ Error rescheduling interview:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/interview/export - Export interview data to CSV
router.get('/export', async (req, res) => {
  try {
    const slots = await InterviewSlot.find({ isBooked: true })
      .populate('applicationId')
      .sort({ date: 1, startTime: 1 });
    
    const csvWriter = createObjectCsvWriter({
      path: path.join(__dirname, '../temp/interviews.csv'),
      header: [
        { id: 'candidateName', title: 'Candidate Name' },
        { id: 'email', title: 'Email' },
        { id: 'role', title: 'Role' },
        { id: 'branch', title: 'Branch' },
        { id: 'year', title: 'Year' },
        { id: 'date', title: 'Interview Date' },
        { id: 'startTime', title: 'Start Time' },
        { id: 'endTime', title: 'End Time' },
        { id: 'interviewer', title: 'Interviewer' },
        { id: 'meetingLink', title: 'Meeting Link' }
      ]
    });
    
    const records = slots.map(slot => ({
      candidateName: slot.applicationId?.name || 'N/A',
      email: slot.applicationId?.email || 'N/A',
      role: slot.applicationId?.role || 'N/A',
      branch: slot.applicationId?.branch || 'N/A',
      year: slot.applicationId?.year || 'N/A',
      date: slot.date.toISOString().split('T')[0],
      startTime: slot.startTime,
      endTime: slot.endTime,
      interviewer: slot.interviewer || 'TBD',
      meetingLink: slot.meetingLink || 'TBD'
    }));
    
    await csvWriter.writeRecords(records);
    
    res.download(path.join(__dirname, '../temp/interviews.csv'), 'interviews.csv', (err) => {
      if (err) {
        console.error('❌ Error downloading file:', err);
        res.status(500).json({ error: 'Error downloading file' });
      }
    });
  } catch (err) {
    console.error('❌ Error exporting interviews:', err);
    res.status(500).json({ error: err.message });
  }
});

// Helper function to send interview notification email
async function sendInterviewNotification(application, slot) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.email,
      subject: 'Interview Scheduled - CodeBusters Club',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Interview Scheduled!</h2>
          <p>Dear ${application.name},</p>
          <p>Congratulations! Your interview for the <strong>${application.role}</strong> position at CodeBusters Club has been scheduled.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Interview Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Date:</strong> ${slot.date.toLocaleDateString()}</li>
              <li><strong>Time:</strong> ${slot.startTime} - ${slot.endTime}</li>
              <li><strong>Interviewer:</strong> ${slot.interviewer}</li>
              ${slot.meetingLink ? `<li><strong>Meeting Link:</strong> <a href="${slot.meetingLink}">${slot.meetingLink}</a></li>` : ''}
            </ul>
          </div>
          
          <p>Please be prepared and join the interview on time. Good luck!</p>
          
          <p>Best regards,<br>CodeBusters Club Team</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Interview notification sent to:', application.email);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

// Helper function to create Google Calendar event
async function createGoogleCalendarEvent(application, slot) {
  try {
    const event = {
      summary: `Interview: ${application.name} - ${application.role}`,
      description: `Interview for ${application.name} (${application.email}) for the ${application.role} position at CodeBusters Club.`,
      start: {
        dateTime: `${slot.date.toISOString().split('T')[0]}T${slot.startTime}:00`,
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: `${slot.date.toISOString().split('T')[0]}T${slot.endTime}:00`,
        timeZone: 'Asia/Kolkata'
      },
      attendees: [
        { email: application.email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
    
    console.log('✅ Google Calendar event created:', response.data.htmlLink);
    
    // Update slot with meeting link
    slot.meetingLink = response.data.htmlLink;
    await slot.save();
    
  } catch (error) {
    console.error('❌ Error creating Google Calendar event:', error);
  }
}

module.exports = router;
