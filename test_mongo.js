const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vibecheck')
  .then(async () => {
    console.log('Connected to MongoDB');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Current collections:', collections.map(c => c.name));
    
    // Check users
    const usersCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log('Number of documents in users collection:', usersCount);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Mongo error:', err);
    process.exit(1);
  });
