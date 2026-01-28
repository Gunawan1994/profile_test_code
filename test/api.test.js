const request = require('supertest');
const mongoose = require('mongoose');
const { app, startServer } = require('../app');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Comment = require('../models/Comment');

let server;

beforeAll(async () => {
  await startServer();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (server && server.close) server.close();
});

beforeEach(async () => {
  // Clear all collections before each test for isolation
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].deleteMany({});
  }
});

describe('Profile API', () => {
  it('should create a new profile', async () => {
    const res = await request(app)
      .post('/')
      .send({ name: 'Test User', description: 'desc' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test User');
  });

  it('should get a profile by id', async () => {
    const profile = await Profile.create({ name: 'Find Me' });
    const res = await request(app).get(`/${profile._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Find Me');
  });
});

describe('User, Comment, and Voting API', () => {
  let user, profile;

  beforeEach(async () => {
    user = await User.create({ name: 'Commenter' });
    profile = await Profile.create({ name: 'Profile for Comment' });
  });

  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'New User' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('New User');
  });

  it('should post a comment', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ profileId: profile._id, userId: user._id, text: 'Nice profile!' });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Nice profile!');
  });

  it('should get comments for a profile', async () => {
    // First, create a comment
    await Comment.create({ profileId: profile._id, userId: user._id, text: 'Nice profile!' });
    const res = await request(app)
      .get('/api/comments')
      .query({ profileId: profile._id });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].text).toBe('Nice profile!');
  });

  it('should like and unlike a comment', async () => {
    // Create a comment first
    const createdComment = await Comment.create({ profileId: profile._id, userId: user._id, text: 'Nice profile!' });
    let res = await request(server)
      .post(`/api/comments/${createdComment._id}/like`)
      .send({ userId: user._id });
    expect(res.statusCode).toBe(200);
    expect(res.body.likes).toContain(user._id.toString());

    res = await request(server)
      .post(`/api/comments/${createdComment._id}/unlike`)
      .send({ userId: user._id });
    expect(res.statusCode).toBe(200);
    expect(res.body.likes).not.toContain(user._id.toString());
  });
});