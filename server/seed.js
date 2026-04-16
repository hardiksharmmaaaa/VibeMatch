const mongoose = require('mongoose');
require('dotenv').config();

// Create schema mapping to what we have in server.js
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{
    email: String,
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
  }],
  invitesSent: [{
    date: { type: Date, default: Date.now },
    email: String
  }]
}, { collection: 'users' }); 

const User = mongoose.model('User', UserSchema);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vibecheck')
  .then(async () => {
    console.log('Connected to MongoDB. Seeding users...');
    
    // Clear out existing if they wanted a fresh collection rewrite
    await User.deleteMany({});
    
    // Seed initial users into the "users" collection
    const testUserA = new User({
      username: 'Alice (Test)',
      email: 'alice@example.com',
      password: 'password123',
      friends: []
    });
    
    const testUserB = new User({
      username: 'Bob (Test)',
      email: 'bob@example.com',
      password: 'password123',
      friends: []
    });

    await testUserA.save();
    console.log("Created user:", testUserA.email);

    await testUserB.save();
    console.log("Created user:", testUserB.email);

    console.log("Successfully rebuilt and seeded the 'users' collection!");
    process.exit(0);
  })
  .catch(err => {
    console.error('Mongo error:', err);
    process.exit(1);
  });
