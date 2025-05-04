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

router.post('/:id/like', protect, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      // Prevent double like
      if (post.likes.includes(req.user.id)) {
        return res.status(400).json({ message: 'Already liked' });
      }
  
      post.likes.push(req.user.id);
      await post.save();
      res.json({ message: 'Post liked', likes: post.likes.length });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
});
  
router.post('/:id/unlike', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.likes = post.likes.filter(
        (userId) => userId.toString() !== req.user.id
        );
        await post.save();
        res.json({ message: 'Post unliked', likes: post.likes.length });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
  

module.exports = router;