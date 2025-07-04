// Demo script to generate sample application data
const mongoose = require('mongoose');
const Application = require('./models/Application');
require('dotenv').config();

const sampleApplications = [
  {
    name: "Arjun Sharma",
    email: "arjun.sharma@gla.ac.in",
    phone: "9876543210",
    rollNumber: "CS2024001",
    branch: "Computer Science",
    year: "2",
    role: "Technical",
    githubProfile: "https://github.com/arjunsharma",
    linkedinProfile: "https://linkedin.com/in/arjunsharma",
    skills: "JavaScript, React, Node.js, MongoDB, Python",
    experience: "Built a web application for college events, contributed to 3 open-source projects",
    motivation: "I want to improve my coding skills and work on innovative projects with the CodeBusters team.",
    status: "Applied"
  },
  {
    name: "Priya Patel",
    email: "priya.patel@gla.ac.in",
    phone: "9876543211",
    rollNumber: "CS2024002",
    branch: "Computer Science",
    year: "3",
    role: "Design",
    githubProfile: "https://github.com/priyapatel",
    linkedinProfile: "https://linkedin.com/in/priyapatel",
    skills: "UI/UX Design, Figma, Adobe Creative Suite, HTML, CSS",
    experience: "Designed user interfaces for 2 mobile apps, freelance graphic designer",
    motivation: "I love creating beautiful and functional designs that enhance user experience.",
    status: "Shortlisted"
  },
  {
    name: "Rohit Kumar",
    email: "rohit.kumar@gla.ac.in",
    phone: "9876543212",
    rollNumber: "IT2024001",
    branch: "Information Technology",
    year: "2",
    role: "Technical",
    githubProfile: "https://github.com/rohitkumar",
    linkedinProfile: "https://linkedin.com/in/rohitkumar",
    skills: "Java, Spring Boot, MySQL, Docker, AWS",
    experience: "Internship at a tech startup, built RESTful APIs for e-commerce platform",
    motivation: "I want to work on challenging technical problems and learn from experienced developers.",
    status: "Selected"
  },
  {
    name: "Sneha Gupta",
    email: "sneha.gupta@gla.ac.in",
    phone: "9876543213",
    rollNumber: "CS2024003",
    branch: "Computer Science",
    year: "1",
    role: "Content",
    githubProfile: "https://github.com/snehagupta",
    linkedinProfile: "https://linkedin.com/in/snehagupta",
    skills: "Content Writing, Social Media Management, Copywriting, SEO",
    experience: "Content writer for college magazine, managed social media for student events",
    motivation: "I want to create engaging content that promotes CodeBusters and attracts new members.",
    status: "Applied"
  },
  {
    name: "Amit Singh",
    email: "amit.singh@gla.ac.in",
    phone: "9876543214",
    rollNumber: "EC2024001",
    branch: "Electronics",
    year: "3",
    role: "Management",
    githubProfile: "https://github.com/amitsingh",
    linkedinProfile: "https://linkedin.com/in/amitsingh",
    skills: "Project Management, Team Leadership, Event Planning, Communication",
    experience: "Led a team of 10 students for technical fest, organized 5 successful events",
    motivation: "I want to contribute to the growth of CodeBusters through effective management and leadership.",
    status: "Shortlisted"
  },
  {
    name: "Kavya Reddy",
    email: "kavya.reddy@gla.ac.in",
    phone: "9876543215",
    rollNumber: "CS2024004",
    branch: "Computer Science",
    year: "2",
    role: "Technical",
    githubProfile: "https://github.com/kavyareddy",
    linkedinProfile: "https://linkedin.com/in/kavyareddy",
    skills: "Python, Data Science, Machine Learning, TensorFlow, Pandas",
    experience: "Built ML models for predicting student performance, data analysis internship",
    motivation: "I'm passionate about using data and AI to solve real-world problems.",
    status: "Applied"
  },
  {
    name: "Vikram Joshi",
    email: "vikram.joshi@gla.ac.in",
    phone: "9876543216",
    rollNumber: "ME2024001",
    branch: "Mechanical",
    year: "4",
    role: "Technical",
    githubProfile: "https://github.com/vikramjoshi",
    linkedinProfile: "https://linkedin.com/in/vikramjoshi",
    skills: "IoT, Arduino, Raspberry Pi, CAD, 3D Printing",
    experience: "Developed IoT-based smart home system, winner of hackathon 2023",
    motivation: "I want to bridge the gap between mechanical engineering and software development.",
    status: "Rejected"
  },
  {
    name: "Neha Agarwal",
    email: "neha.agarwal@gla.ac.in",
    phone: "9876543217",
    rollNumber: "CS2024005",
    branch: "Computer Science",
    year: "1",
    role: "Design",
    githubProfile: "https://github.com/nehaagarwal",
    linkedinProfile: "https://linkedin.com/in/nehaagarwal",
    skills: "Graphic Design, Video Editing, Photoshop, Illustrator",
    experience: "Created promotional materials for college events, freelance designer",
    motivation: "I want to create visually appealing content that represents CodeBusters.",
    status: "Applied"
  }
];

const populateData = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/club-recruitment';
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing applications
    await Application.deleteMany({});
    console.log('🗑️ Cleared existing applications');
    
    // Insert sample applications
    await Application.insertMany(sampleApplications);
    console.log('📝 Inserted sample applications');
    
    // Display statistics
    const stats = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('📊 Application statistics:', stats);
    
    console.log('✅ Demo data population completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating demo data:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  populateData();
}

module.exports = { sampleApplications, populateData };
