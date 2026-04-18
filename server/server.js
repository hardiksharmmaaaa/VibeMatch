const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key'); 
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vibecheck')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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
  }],
  checkIns: [{
    date: { type: Date, default: Date.now },
    score: Number
  }],
  latestRating: { type: Number, default: null },
  phone: { type: String, default: '+91 ' },
  bio: { type: String, default: 'Just a vibe check bestie 🌸' }
});
const User = mongoose.model('User', UserSchema);

const ProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '+91 ' },
  bio: { type: String, default: 'Just a vibe check bestie 🌸' },
  avatarSeed: { type: String, default: 'User' }
}, { collection: 'Profile' });
const Profile = mongoose.model('Profile', ProfileSchema);

const GameSessionSchema = new mongoose.Schema({
  pair: [String], // Emails
  status: { type: String, enum: ['waiting', 'ready'], default: 'waiting' },
  initiatedBy: String,
  updatedAt: { type: Date, default: Date.now, expires: 300 }
});
const GameSession = mongoose.model('GameSession', GameSessionSchema);

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: { username, email, friends: [], checkIns: [], latestRating: null } });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const profile = await Profile.findOne({ email });
    res.status(200).json({ 
      message: 'Login successful', 
      user: { 
        username: user.username, 
        email: user.email, 
        friends: user.friends, 
        checkIns: user.checkIns, 
        latestRating: user.latestRating, 
        phone: profile?.phone || '+91 ', 
        bio: profile?.bio || 'Just a vibe check bestie 🌸',
        avatarSeed: profile?.avatarSeed || 'User'
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ 
        username: name, 
        email, 
        password: `google_${googleId}`, // Placeholder for schema requirement
        friends: [] 
      });
      await user.save();
    }

    const profile = await Profile.findOne({ email });
    res.status(200).json({ 
      message: 'Google login successful', 
      user: { 
        username: user.username, 
        email: user.email, 
        friends: user.friends, 
        checkIns: user.checkIns, 
        latestRating: user.latestRating, 
        phone: profile?.phone || '+91 ', 
        bio: profile?.bio || 'Just a vibe check bestie 🌸',
        avatarSeed: profile?.avatarSeed || 'User'
      } 
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});


app.get('/api/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    let profile = await Profile.findOne({ email: req.params.email });
    if (!profile) {
      // Create a default profile if it doesn't exist yet
      profile = new Profile({ email: req.params.email });
      await profile.save();
    }

    res.status(200).json({ 
      user: { 
        username: user.username, 
        email: user.email, 
        friends: user.friends, 
        checkIns: user.checkIns, 
        latestRating: user.latestRating, 
        phone: profile.phone, 
        bio: profile.bio,
        avatarSeed: profile.avatarSeed
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

app.post('/api/user/:email/score', async (req, res) => {
  try {
    const { score } = req.body;
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Add check-in
    user.checkIns.push({ date: new Date(), score });
    user.latestRating = score; // Store in the dedicated latest rating field
    await user.save();
    
    res.status(200).json({ message: 'Score saved tracking complete', checkIns: user.checkIns, latestRating: user.latestRating });
  } catch (error) {
    res.status(500).json({ error: 'Error saving score' });
  }
});

// Resend Email logic & Rate Limiter
app.post('/api/invite', async (req, res) => {
  try {
    const { myEmail, myName, bestieEmail } = req.body;
    const user = await User.findOne({ email: myEmail });
    if (!user) return res.status(404).json({ error: 'Sender not found' });

    // Enforce 2 invites per day calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const invitesToday = user.invitesSent.filter(inv => inv.date >= today);

    if (invitesToday.length >= 2) {
      return res.status(429).json({ error: 'Daily notification limit reached. You can only send 2 invites per day.' });
    }

    // Check if friend is already in list
    const existingFriend = user.friends.find(f => f.email === bestieEmail);
    if (!existingFriend) {
      user.friends.push({ email: bestieEmail, status: 'pending' });
    }
    
    user.invitesSent.push({ email: bestieEmail, date: new Date() });
    await user.save();

    // Setup Resend payload
    const acceptLink = `http://localhost:5001/api/accept?from=${myEmail}&to=${bestieEmail}`;

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Setup Nodemailer
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: `"VibeCheck" <${process.env.EMAIL_USER}>`,
          to: bestieEmail,
          subject: `💌 ${myName} nominated you on VibeCheck!`,
          html: `
            <div style="font-family: sans-serif; text-align: center; color: #333;">
              <h2>You've been nominated!</h2>
              <p><strong>${myName}</strong> (${myEmail}) wants to be your Bestie on VibeCheck!</p>
              <p>Link your accounts to start sharing your daily vibes.</p>
              <a href="${acceptLink}" style="display:inline-block; padding:12px 24px; background:#00d2ff; color:#fff; text-decoration:none; border-radius:8px; font-weight:bold; margin-top:20px;">Accept Invitation</a>
            </div>
          `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully via Nodemailer:", result.messageId);
        
      } else if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder_key') {
        const { data, error } = await resend.emails.send({
          from: 'VibeCheck Team <onboarding@resend.dev>', // Free tier must use this
          to: bestieEmail, // Note: On free tier, this MUST be the same email you registered with on Resend
          subject: `💌 ${myName} nominated you on VibeCheck!`,
          html: `
            <div style="font-family: sans-serif; text-align: center; color: #333;">
              <h2>You've been nominated!</h2>
              <p><strong>${myName}</strong> (${myEmail}) wants to be your Bestie on VibeCheck!</p>
              <p>Link your accounts to start sharing your daily vibes.</p>
              <a href="${acceptLink}" style="display:inline-block; padding:12px 24px; background:#00d2ff; color:#fff; text-decoration:none; border-radius:8px; font-weight:bold; margin-top:20px;">Accept Invitation</a>
            </div>
          `
        });
        
        if (error) {
          console.error("Resend API returned an error:", error);
          return res.status(400).json({ error: `Email Error: ${error.message}. Wait, using Resend Free tier you can only send to yourself.` });
        }
      } else {
        console.warn("No EMAIL_USER or RESEND_API_KEY found. Simulating email dispatch.");
        console.log(`[SIMULATED EMAIL] To: ${bestieEmail}. Accept link: ${acceptLink}`);
      }
    } catch(emailErr) {
      console.error("Email delivery failed completely:", emailErr);
      return res.status(500).json({ error: "Server crashed while trying to send email" });
    }
    
    res.status(200).json({ message: 'Invitation sent via Resend successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error processing invitation process' });
  }
});

// Acceptance Webhook (Clicked from Email)
app.get('/api/accept', async (req, res) => {
  try {
    const { from, to } = req.query; // 'from' is the original sender, 'to' is the receiver (Bestie)

    // Update Original Sender's DB
    const sender = await User.findOne({ email: from });
    if (sender) {
      const f1 = sender.friends.find(f => f.email === to);
      if (f1) f1.status = 'accepted';
      else sender.friends.push({ email: to, status: 'accepted' });
      await sender.save();
    }

    // Now update or create the Bestie Receiver symmetrically
    let receiver = await User.findOne({ email: to });
    if (receiver) {
      const f2 = receiver.friends.find(f => f.email === from);
      if (f2) f2.status = 'accepted';
      else receiver.friends.push({ email: from, status: 'accepted' });
      await receiver.save();
    } 

    res.send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h2>VibeCheck Mutual Sync Established! 🎉</h2>
        <p>You can now close this tab and return to the app.</p>
        <a href="http://localhost:5173" style="color: #00d2ff;">Go to VibeCheck</a>
      </div>
    `);
  } catch (err) {
    res.status(500).send('Error linking accounts');
  }
});

app.post('/api/user/:email/update', async (req, res) => {
  try {
    const { username, phone, bio, avatarSeed } = req.body;
    
    // Update basic user info
    const user = await User.findOneAndUpdate(
       { email: req.params.email }, 
       { username }, 
       { returnDocument: 'after' }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update or Create profile in the new 'profile' collection
    const profile = await Profile.findOneAndUpdate(
      { email: req.params.email },
      { phone, bio, avatarSeed },
      { returnDocument: 'after', upsert: true }
    );

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: { 
        username: user.username, 
        email: user.email, 
        friends: user.friends, 
        checkIns: user.checkIns, 
        latestRating: user.latestRating, 
        phone: profile.phone, 
        bio: profile.bio,
        avatarSeed: profile.avatarSeed
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// GAME LOBBY ENDPOINTS
app.post('/api/game/invite', async (req, res) => {
  try {
    const { from, to } = req.body;
    const pair = [from, to].sort();
    
    const session = await GameSession.findOneAndUpdate(
      { pair },
      { status: 'waiting', initiatedBy: from, updatedAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );
    
    res.status(200).json({ session });
  } catch (err) {
    res.status(500).json({ error: 'Error initiating game' });
  }
});

app.post('/api/game/join', async (req, res) => {
  try {
    const { from, to } = req.body;
    const pair = [from, to].sort();
    
    const session = await GameSession.findOneAndUpdate(
      { pair },
      { status: 'ready', updatedAt: new Date() },
      { returnDocument: 'after' }
    );
    
    res.status(200).json({ session });
  } catch (err) {
    res.status(500).json({ error: 'Error joining game' });
  }
});

app.get('/api/game/status/:email1/:email2', async (req, res) => {
  try {
    const pair = [req.params.email1, req.params.email2].sort();
    const session = await GameSession.findOne({ pair });
    res.status(200).json({ session });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching game status' });
  }
});

app.post('/api/game/cancel', async (req, res) => {
  try {
    const { from, to } = req.body;
    const pair = [from, to].sort();
    await GameSession.deleteOne({ pair });
    res.status(200).json({ message: 'Game cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Error cancelling game' });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
