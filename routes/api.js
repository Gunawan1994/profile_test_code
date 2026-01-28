const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Comment = require('../models/Comment');
const Profile = require('../models/Profile');

// Utility to convert camelCase to snake_case recursively
function toSnakeCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/([A-Z])/g, '_$1').toLowerCase(),
        toSnakeCase(v)
      ])
    );
  }
  return obj;
}

// Create user
router.post('/users', async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.create({ name });
    res.status(201).json(toSnakeCase(user.toObject()));
  } catch (err) {
    next(err);
  }
});

// Post comment
router.post('/comments', async (req, res, next) => {
  try {
    const profile_id = req.body.profile_id;
    const user_id = req.body.user_id;
    const text = req.body.text;
    const comment = await Comment.create({ profile: profile_id, user: user_id, text });
    res.status(201).json(toSnakeCase(comment.toObject()));
  } catch (err) {
    next(err);
  }
});

// Get comments
router.get('/comments', async (req, res, next) => {
  try {
    const profile_id = req.query.profile_id;
    const sort_by = req.query.sort_by || 'createdAt';
    const order = req.query.order || 'desc';
    const filter = profile_id ? { profile: profile_id } : {};
    const comments = await Comment.find(filter)
      .populate('user', 'name')
      .sort({ [sort_by]: order === 'asc' ? 1 : -1 });
    res.json(toSnakeCase(comments.map(c => c.toObject())));
  } catch (err) {
    next(err);
  }
});

// Like a comment
router.post('/comments/:id/like', async (req, res, next) => {
  try {
    const user_id = req.body.user_id;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: user_id } },
      { new: true }
    );
    res.json(toSnakeCase(comment.toObject()));
  } catch (err) {
    next(err);
  }
});

// Unlike a comment
router.post('/comments/:id/unlike', async (req, res, next) => {
  try {
    const user_id = req.body.user_id;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: user_id } },
      { new: true }
    );
    res.json(toSnakeCase(comment.toObject()));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
