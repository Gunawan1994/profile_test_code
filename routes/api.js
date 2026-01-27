const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Comment = require('../models/Comment');
const Profile = require('../models/Profile');

// Create user
router.post('/users', async (req, res, next) => {
  try {
    const user = await User.create({ name: req.body.name });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// Post comment
router.post('/comments', async (req, res, next) => {
  try {
    const { profileId, userId, text } = req.body;
    const comment = await Comment.create({ profile: profileId, user: userId, text });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

// Get comments
router.get('/comments', async (req, res, next) => {
  try {
    const { profileId, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = profileId ? { profile: profileId } : {};
    const comments = await Comment.find(filter)
      .populate('user', 'name')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

// Like a comment
router.post('/comments/:id/like', async (req, res, next) => {
  try {
    const { userId } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

// Unlike a comment
router.post('/comments/:id/unlike', async (req, res, next) => {
  try {
    const { userId } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: userId } },
      { new: true }
    );
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
