// server/seed.js
const mongoose = require('mongoose');
const Application = require('./models/Application');
require('dotenv').config();

const sampleApplications = [];

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
