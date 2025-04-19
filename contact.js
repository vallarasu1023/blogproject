const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const router=express.Router()


// Initialize Express


// MongoDB Connection
mongoose.connect('mongodb+srv://vallarasu1023:CCH8j45cvdlQpQCK@cluster0.ea4xptv.mongodb.net/blogSite?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define Mongoose Schema
const supportSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const SupportRequest = mongoose.model('SupportRequest', supportSchema);

// Create Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bloggersite028@gmail.com',
    pass: 'jbrx vbvq rycx nlgs'
  }
});

// API Endpoint to handle form submission
router.post('/submit-support', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Save support request to MongoDB
    const newSupport = new SupportRequest({ name, email, subject, message });
    await newSupport.save();

    // Email to Admin
    const adminMailOptions = {
      from: 'bloggersite028@gmail.com',
      to: 'bloggersite028@gmail.com',
      subject: `New Support Request: ${subject}`,
      html: `
        <h3>New Support Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    };

    // Email to User
    const userMailOptions = {
      from: 'bloggersite028@gmail.com',
      to: email,
      subject: 'We Received Your Support Request',
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out to us. We’ve received your message regarding: <strong>${subject}</strong>.</p>
        <p>Our team will get back to you as soon as possible.</p>
        <p>Best,<br/>Blog Site Support Team</p>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({ message: 'Your support request has been submitted and emails have been sent.' });
  } catch (error) {
    console.error('Error while submitting support request:', error);
    res.status(500).json({ message: 'An error occurred while submitting your request.' });
  }
});

// Optional: Root test route
router.get('/', (req, res) => {
  res.send('Contact Support Backend is Running');
});

module.exports=router

