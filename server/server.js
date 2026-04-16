const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vibecheck';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Database Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bestieEmail: { type: String, default: null }
});
const User = mongoose.model('User', UserSchema);

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    // In a real app we would hash the password using bcrypt here
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: { username, email } });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', user: { username: user.username, email: user.email, bestieEmail: user.bestieEmail } });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Standard configuration for easy demonstration
  auth: {
    user: process.env.EMAIL_USER || 'vibecheck.invite@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_app_password_here'
  }
});

// Invite Bestie Route
app.post('/api/invite', async (req, res) => {
  try {
    const { myEmail, myName, bestieEmail } = req.body;
    
    // Save the linkage in the database locally
    await User.updateOne({ email: myEmail }, { bestieEmail: bestieEmail });

    // Try sending email (Note: may fail locally if process.env.EMAIL_USER is not configured properly)
    const mailOptions = {
      from: process.env.EMAIL_USER || 'vibecheck.invite@gmail.com',
      to: bestieEmail,
      subject: `💌 ${myName} nominated you on VibeCheck!`,
      html: `
        <div style="font-family: sans-serif; text-align: center; color: #333;">
          <h2>You've been nominated!</h2>
          <p><strong>${myName}</strong> (${myEmail}) wants to be your Bestie on VibeCheck!</p>
          <p>Link your accounts to start sharing your daily vibes.</p>
          <a href="http://localhost:5173" style="display:inline-block; padding:12px 24px; background:#00d2ff; color:#fff; text-decoration:none; border-radius:8px; font-weight:bold; margin-top:20px;">Accept Invitation</a>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);
        // We still return success for the linkage even if email dispatch fails (due to missing credentials)
        return res.status(200).json({ 
          message: 'Nomination saved! (Email dispatch failed due to missing SMTP credentials)', 
          warning: error.message 
        });
      }
      res.status(200).json({ message: 'Invitation sent via email successfully!' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error processing invitation' });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
