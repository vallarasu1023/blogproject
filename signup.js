const express = require('express');
const mongoose = require('mongoose');
const router=express.Router()
const User = require('./model'); // Make sure your model file is named correctly
// const app = express();

// const PORT = 3020;



// MongoDB Connection
mongoose.connect('mongodb+srv://vallarasu1023:vallarasu2003@cluster0.ea4xptv.mongodb.net/blogSite?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Email & password regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

// ✅ Register New User
router.post('/sign', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters, include one letter and one number' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser = new User({ name, email, password: password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login Route (Fixed)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }



  if (password!=user.password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters, include one letter and one number' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Get All Users (optional route)
router.get('/sign', async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});
module.exports=router

// ✅ Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
