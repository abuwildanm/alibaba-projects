# Lovara Database Implementation

## Overview
This document describes the database implementation for the Lovara dating application. The database provides persistent storage for user profiles, matches, messages, events, and other application data.

## Database Schema

### Core Tables
1. **users** - Stores user account information
2. **matches** - Tracks user matches
3. **conversations** - Manages user conversations
4. **messages** - Stores individual messages
5. **events** - Manages events and activities
6. **user_interests** - Links users to their interests
7. **user_settings** - Stores user preferences
8. **blocks** - Tracks user blocks
9. **reports** - Stores user reports

### Key Features
- User authentication and profile management
- Matching algorithm with preference-based filtering
- Real-time messaging system
- Events and activities management
- Privacy and safety controls

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Authenticate user

### User Management
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile

### Discovery
- `GET /api/discover` - Get potential matches
- `POST /api/like/:userId` - Like a user
- `POST /api/pass/:userId` - Pass on a user

### Matches
- `GET /api/matches` - Get user's matches

### Messaging
- `GET /api/conversations` - Get user's conversations
- `GET /api/conversations/:conversationId/messages` - Get messages in a conversation
- `POST /api/conversations/:conversationId/messages` - Send a message
- `POST /api/users/:userId/message` - Create conversation and send message

### Events
- `GET /api/events` - Get events
- `POST /api/events` - Create event
- `POST /api/events/:eventId/join` - Join event

## Backend Implementation

### Technologies Used
- Node.js with Express.js
- SQLite database (file-based, no server required)
- JWT for authentication
- bcrypt for password hashing

### Setup Instructions

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables**
Create a `.env` file in the root directory:
```
JWT_SECRET=lovara_super_secret_key_for_testing_purposes_only
PORT=5000
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Initialize Database**
The application automatically creates tables on startup.

4. **Start Server**
```bash
npm start
```

## Frontend Integration

### API Base URL
The frontend connects to the backend API at `http://localhost:5000/api` by default. This can be changed using the `REACT_APP_API_URL` environment variable.

### Authentication
- Tokens are stored in sessionStorage
- Authorization headers are included in API requests
- Session management handles login/logout

## Data Flow

1. User registers/logs in via API
2. User data is stored in the database
3. Discovery algorithm finds potential matches based on preferences
4. When users like each other, a match is created
5. Users can exchange messages through the messaging system
6. Users can participate in events

## Security Measures

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation and sanitization
- SQL injection prevention through parameterized queries
- CORS policies implemented

## Scalability Considerations

- Connection pooling for database connections
- Efficient indexing on frequently queried fields
- Pagination for large datasets
- Caching strategies for frequently accessed data

## Future Enhancements

- Real-time notifications using WebSockets
- Image storage integration
- Advanced matching algorithms
- Analytics and reporting
- Admin dashboard for moderation