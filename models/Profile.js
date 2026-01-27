const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  mbti: String,
  enneagram: String,
  variant: String,
  tritype: Number,
  socionics: String,
  sloan: String,
  psyche: String,
  image: String,
});

module.exports = mongoose.model('Profile', ProfileSchema);