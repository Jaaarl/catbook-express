const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// POST /api/posts - Create a new post

router.post('/', protect, async (req, res) =>  {
    
  try {
    const { text, image } = req.body;

    const newPost = new Post({
      author: req.user.id,
      text,
      image,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/feed - Get all posts, newest first
router.get('/feed', protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name'); // Show author name only

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;