// server/seedTasks.js
const mongoose = require('mongoose');
const Task = require('./models/Task');
require('dotenv').config();

const sampleTasks = [];

async function seedTasks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB for task seeding');

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing tasks');

    // Insert sample tasks
    const insertedTasks = await Task.insertMany(sampleTasks);
    console.log(`✅ Seeded ${insertedTasks.length} sample tasks`);

    console.log('\n📋 Sample Tasks Created:');
    insertedTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (${task.difficulty}) - ${task.category}`);
    });

    console.log('\n🎉 Task seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB');
  }
}

// Run the seeding
if (require.main === module) {
  seedTasks();
}

module.exports = { seedTasks, sampleTasks };
