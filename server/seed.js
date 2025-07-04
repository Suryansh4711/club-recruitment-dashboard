// server/seed.js
const mongoose = require('mongoose');
const Application = require('./models/Application');
require('dotenv').config();

const sampleApplications = [
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@gla.ac.in',
    phone: '9876543210',
    rollNumber: '12345678',
    branch: 'Computer Science',
    year: 3,
    role: 'Technical',
    githubProfile: 'https://github.com/alicejohnson',
    linkedinProfile: 'https://linkedin.com/in/alicejohnson',
    skills: 'JavaScript, React, Node.js, Python, MongoDB',
    experience: 'Built 3 full-stack web applications, contributed to 2 open-source projects',
    motivation: 'I want to develop my leadership skills and contribute to the tech community at GLA University',
    status: 'Applied'
  },
  {
    name: 'Bob Smith',
    email: 'bob.smith@gla.ac.in',
    phone: '9876543211',
    rollNumber: '12345679',
    branch: 'Information Technology',
    year: 2,
    role: 'Design',
    githubProfile: 'https://github.com/bobsmith',
    linkedinProfile: 'https://linkedin.com/in/bobsmith',
    skills: 'UI/UX Design, Figma, Adobe Creative Suite, HTML, CSS',
    experience: 'Designed interfaces for 5 mobile apps, freelance UI/UX designer',
    motivation: 'I am passionate about creating user-friendly designs and want to help the club with visual identity',
    status: 'Shortlisted'
  },
  {
    name: 'Carol Williams',
    email: 'carol.williams@gla.ac.in',
    phone: '9876543212',
    rollNumber: '12345680',
    branch: 'Computer Science',
    year: 4,
    role: 'Management',
    githubProfile: 'https://github.com/carolwilliams',
    linkedinProfile: 'https://linkedin.com/in/carolwilliams',
    skills: 'Project Management, Team Leadership, Strategic Planning, Communication',
    experience: 'Led a team of 10 developers, managed 3 successful product launches',
    motivation: 'I want to use my leadership experience to help coordinate club activities and events',
    status: 'Selected'
  },
  {
    name: 'David Brown',
    email: 'david.brown@gla.ac.in',
    phone: '9876543213',
    rollNumber: '12345681',
    branch: 'Electronics',
    year: 1,
    role: 'Technical',
    githubProfile: 'https://github.com/davidbrown',
    linkedinProfile: 'https://linkedin.com/in/davidbrown',
    skills: 'Arduino, Raspberry Pi, IoT, Python, C++',
    experience: 'Built 2 IoT projects, participated in 3 hackathons',
    motivation: 'I am interested in hardware-software integration and want to learn from experienced members',
    status: 'Applied'
  },
  {
    name: 'Emma Davis',
    email: 'emma.davis@gla.ac.in',
    phone: '9876543214',
    rollNumber: '12345682',
    branch: 'Information Technology',
    year: 3,
    role: 'Content',
    githubProfile: 'https://github.com/emmadavis',
    linkedinProfile: 'https://linkedin.com/in/emmadavis',
    skills: 'Content Writing, Social Media Management, SEO, Digital Marketing',
    experience: 'Managed social media for 2 startups, wrote technical blogs with 10k+ views',
    motivation: 'I want to help the club build its online presence and create engaging content',
    status: 'Shortlisted'
  },
  {
    name: 'Frank Wilson',
    email: 'frank.wilson@gla.ac.in',
    phone: '9876543215',
    rollNumber: '12345683',
    branch: 'Computer Science',
    year: 2,
    role: 'Technical',
    githubProfile: 'https://github.com/frankwilson',
    linkedinProfile: 'https://linkedin.com/in/frankwilson',
    skills: 'Java, Spring Boot, MySQL, Docker, AWS',
    experience: 'Developed 2 enterprise applications, interned at a fintech company',
    motivation: 'I want to share my knowledge of backend development and learn from other talented developers',
    status: 'Applied'
  },
  {
    name: 'Grace Miller',
    email: 'grace.miller@gla.ac.in',
    phone: '9876543216',
    rollNumber: '12345684',
    branch: 'Mechanical',
    year: 4,
    role: 'Design',
    githubProfile: 'https://github.com/gracemiller',
    linkedinProfile: 'https://linkedin.com/in/gracemiller',
    skills: 'CAD Design, 3D Modeling, Graphic Design, Blender',
    experience: 'Created 3D models for 4 engineering projects, designed logos for 3 organizations',
    motivation: 'I want to combine my engineering background with design skills to create innovative solutions',
    status: 'Rejected'
  },
  {
    name: 'Henry Taylor',
    email: 'henry.taylor@gla.ac.in',
    phone: '9876543217',
    rollNumber: '12345685',
    branch: 'Information Technology',
    year: 1,
    role: 'Technical',
    githubProfile: 'https://github.com/henrytaylor',
    linkedinProfile: 'https://linkedin.com/in/henrytaylor',
    skills: 'Python, Django, PostgreSQL, Git, Linux',
    experience: 'Built a web application for local business, completed 2 online courses',
    motivation: 'I am eager to learn advanced technologies and work on real-world projects',
    status: 'Applied'
  },
  {
    name: 'Ivy Anderson',
    email: 'ivy.anderson@gla.ac.in',
    phone: '9876543218',
    rollNumber: '12345686',
    branch: 'Computer Science',
    year: 3,
    role: 'Management',
    githubProfile: 'https://github.com/ivyanderson',
    linkedinProfile: 'https://linkedin.com/in/ivyanderson',
    skills: 'Agile Management, Scrum, Team Coordination, Public Speaking',
    experience: 'Organized 2 tech conferences, managed cross-functional teams of 15 people',
    motivation: 'I want to help organize club events and foster a collaborative environment',
    status: 'Selected'
  },
  {
    name: 'Jack Thompson',
    email: 'jack.thompson@gla.ac.in',
    phone: '9876543219',
    rollNumber: '12345687',
    branch: 'Electronics',
    year: 2,
    role: 'Technical',
    githubProfile: 'https://github.com/jackthompson',
    linkedinProfile: 'https://linkedin.com/in/jackthompson',
    skills: 'Machine Learning, TensorFlow, Data Analysis, R, Python',
    experience: 'Developed 2 ML models for predictive analysis, published research paper',
    motivation: 'I want to work on AI/ML projects and mentor junior students',
    status: 'Shortlisted'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.log('⚠️  No MONGO_URI found in .env file');
      return;
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing applications
    await Application.deleteMany({});
    console.log('🗑️  Cleared existing applications');

    // Insert sample applications
    await Application.insertMany(sampleApplications);
    console.log('✅ Sample applications inserted successfully');

    // Display stats
    const stats = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('📊 Application stats:', stats);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();
