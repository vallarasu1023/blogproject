const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const router=express.Router()


// Middleware


// Connect to MongoDB
mongoose.connect('mongodb+srv://vallarasu1023:vallarasu2003@cluster0.ea4xptv.mongodb.net/blogSite?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Mongoose Schema
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  date: {
    type: Date,
    default: Date.now, // <- adds date automatically
  },
});

const Blog = mongoose.model('stores', BlogSchema);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Upload Route
router.post('https://blogproject-pk2l.onrender.com/upload', upload.single('file'), async (req, res) => {
  try {
    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      image: `https://blogproject-pk2l.onrender.com/uploads/${req.file.filename}`,
    });
    await newBlog.save();
    res.status(201).json({ message: 'Blog saved!', blog: newBlog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Blogs
router.get('/blogs', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

module.exports=router

