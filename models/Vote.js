const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, enum: [1, -1], required: true }, // like & unlike
});

module.exports = mongoose.model('Vote', VoteSchema);