const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vibecheck')
  .then(async () => {
    const users = await User.find({}, { password: 0 });
    console.log('Users in DB:');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
