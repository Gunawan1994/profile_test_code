'use strict';

'use strict';

const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

module.exports = function() {
  router.get('/:id?', async (req, res, next) => {
    try {
      let profile;
      if (req.params.id) {
        profile = await Profile.findById(req.params.id);
      } else {
        profile = await Profile.findOne().sort({ createdAt: -1 });
      }

      if (!profile) {
        return res.status(404).send('Profile not found');
      }

      const Comment = require('../models/Comment');
      const comments = await Comment.find({ profile: profile._id })
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .lean();

      res.render('profile_template', {
        profile: profile.toObject(),
        comments
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async function(req, res, next) {
    try {
      const data = req.body;
      if (!data.image) {
        data.image = 'https://soulverse.boo.world/images/1.png';
      }
      const profile = await Profile.create(data);
      res.status(201).json(profile);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

