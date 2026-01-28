# Boo Backend Coding Assignment

This is a Node.js backend server for a personality profile and commenting system, using Express, EJS, and an in-memory MongoDB (mongodb-memory-server).

## Features
- Profile data stored in MongoDB (in-memory for testing)
- Create and view personality profiles
- Commenting and voting (like/unlike) on profiles
- User accounts (name only, no authentication)
- Automated tests with Jest and Supertest

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd boo-coding-assigment/server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Server
Start the server with:
```sh
npm start
```
The server will run on [http://localhost:3000](http://localhost:3000) and use an in-memory MongoDB.

### Running Tests
```sh
npm test
```

## API Documentation

### Profile Endpoints
- **POST /**
  - Create a new profile
  - Body:
    ```json
    {
      "name": "string",
      "description": "string",
      "mbti": "string",
      "enneagram": "string",
      "variant": "string",
      "tritype": number,
      "socionics": "string",
      "sloan": "string",
      "psyche": "string",
      "image": "string (optional)"
    }
    ```
- **GET /:id?**
  - Get a profile by ID (or the latest if no ID)


### User Endpoints
- **POST /api/users**
  - Create a new user
  - Body: `{ "name": "string" }`


### Comment Endpoints
- **POST /api/comments**
  - Post a comment
  - Body:
    ```json
    {
      "profile_id": "profile_id",
      "user_id": "user_id",
      "text": "string"
    }
    ```
- **GET /api/comments?profile_id=...&sort_by=createdAt&order=desc**
  - Get comments for a profile


### Voting Endpoints
- **POST /api/comments/:id/like**
  - Like a comment
  - Body: `{ "user_id": "user_id" }`
- **POST /api/comments/:id/unlike**
  - Unlike a comment
  - Body: `{ "user_id": "user_id" }`

## Frontend
- The main profile page is rendered with EJS and styled to match the provided Figma design.
- Comments and like counts update instantly via AJAX (set your userId in browser localStorage).

## Notes
- All data is lost when the server restarts (in-memory DB).
- No authentication or file uploads are implemented.


## Example Like API Usage
```sh
curl -X POST http://localhost:3000/api/comments/<comment_id>/like \
  -H "Content-Type: application/json" \
  -d '{"user_id": "<user_id>"}'
```

---

**Thank you for taking the time to review this assignment. I hope to have the opportunity to join your team.**
