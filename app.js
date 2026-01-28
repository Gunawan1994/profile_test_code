
'use strict';


const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = express();
const port = process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware to parse JSON bodies
app.use(express.json());

// routes
app.use('/', require('./routes/profile')());
app.use('/api', require('./routes/api'));

// Function to connect to in-memory MongoDB and seed data
async function startServer() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to in-memory MongoDB');

  // Seed initial profile data if not present
  const Profile = require('./models/Profile');
  const count = await Profile.countDocuments();
  if (count === 0) {
    const created = await Profile.create({
      name: 'A Martinez',
      description: 'Adolph Larrue Martinez III.',
      mbti: 'ISFJ',
      enneagram: '9w3',
      variant: 'sp/so',
      tritype: 725,
      socionics: 'SEE',
      sloan: 'RCOEN',
      psyche: 'FEVL',
      image: 'https://soulverse.boo.world/images/1.png',
    });
    console.log('seeded initial profile with id:', created._id);
  }
}

// Only start the server if this file is run directly
if (require.main === module) {
  startServer().then(() => {
    app.listen(port, () => {
      console.log('Express started. Listening on %s', port);
    });
  });
}

module.exports = { app, startServer };
