const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Comment = require('../models/Comment');

let server;

beforeAll(async () => {
  server = app.listen(4000);
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('Profile API', () => {
  it('should create a new profile', async () => {
    const res = await request(server)
      .post('/')
      .send({ name: 'Test User', description: 'desc' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test User');
  });

  it('should get a profile by id', async () => {
    const profile = await Profile.create({ name: 'Find Me' });
    const res = await request(server).get(`/${profile._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Find Me');
  });
});

describe('User, Comment, and Voting API', () => {
  let user, profile, comment;
  beforeAll(async () => {
    user = await User.create({ name: 'Commenter' });
    profile = await Profile.create({ name: 'Profile for Comment' });
  });

  it('should create a user', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({ name: 'New User' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('New User');
  });

  it('should post a comment', async () => {
    const res = await request(server)
      .post('/api/comments')
      .send({ profileId: profile._id, userId: user._id, text: 'Nice profile!' });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Nice profile!');
    comment = res.body;
  });

  it('should get comments for a profile', async () => {
    const res = await request(server)
      .get('/api/comments')
      .query({ profileId: profile._id });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].text).toBe('Nice profile!');
  });

  it('should like and unlike a comment', async () => {
    let res = await request(server)
      .post(`/api/comments/${comment._id}/like`)
      .send({ userId: user._id });
    expect(res.statusCode).toBe(200);
    expect(res.body.likes).toContain(user._id.toString());

    res = await request(server)
      .post(`/api/comments/${comment._id}/unlike`)
      .send({ userId: user._id });
    expect(res.statusCode).toBe(200);
    expect(res.body.likes).not.toContain(user._id.toString());
  });
});
