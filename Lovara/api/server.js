// API Server for Lovara application
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Import database utilities and models
const db = require('../db/connection');
const User = require('../db/models/User');
const Match = require('../db/models/Match');
const Message = require('../db/models/Message');
const DatabaseUtils = require('../db/utils');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'lovara_secret_key';

// Utility function to generate ID
const generateId = () => crypto.randomUUID();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Lovara API is running!' });
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, age, gender, bio, interests } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await User.create({
      id: generateId(),
      name,
      email,
      password_hash: hashedPassword,
      age,
      gender,
      bio,
      profile_pic_url: `https://randomuser.me/api/portraits/${gender === 'male' ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
      location: { lat: -6.200000, lng: 106.816666 }, // Jakarta coordinates as default
      distance_preference: 50,
      age_min_preference: 18,
      age_max_preference: 50,
      gender_preference: 'all'
    });

    // Create default settings for the user
    await db.query(`
      INSERT INTO user_settings (id, user_id) VALUES ($1, $2)
    `, [generateId(), newUser.id]);

    // Add interests if provided
    if (interests && Array.isArray(interests)) {
      for (const interestName of interests) {
        // Check if interest exists, if not create it
        let interestResult = await db.query('SELECT id FROM interests WHERE name = $1', [interestName]);
        let interestId;
        
        if (interestResult.rows.length === 0) {
          const newInterestResult = await db.query(`
            INSERT INTO interests (id, name) VALUES ($1, $2) RETURNING id
          `, [generateId(), interestName]);
          interestId = newInterestResult.rows[0].id;
        } else {
          interestId = interestResult.rows[0].id;
        }

        // Link user to interest
        await db.query(`
          INSERT INTO user_interests (id, user_id, interest_id) VALUES ($1, $2, $3)
        `, [generateId(), newUser.id, interestId]);
      }
    }

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        profile_pic_url: newUser.profile_pic_url
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Update last active
    await user.update({ last_active: new Date() });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_pic_url: user.profile_pic_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      bio: user.bio,
      profile_pic_url: user.profile_pic_url,
      location: user.location,
      distance_preference: user.distance_preference,
      age_min_preference: user.age_min_preference,
      age_max_preference: user.age_max_preference,
      gender_preference: user.gender_preference,
      last_active: user.last_active
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {};
    const allowedFields = ['name', 'age', 'gender', 'bio', 'profile_pic_url', 'location', 
                          'distance_preference', 'age_min_preference', 'age_max_preference', 'gender_preference'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const updatedUser = await user.update(updateData);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        gender: updatedUser.gender,
        bio: updatedUser.bio,
        profile_pic_url: updatedUser.profile_pic_url,
        location: updatedUser.location,
        distance_preference: updatedUser.distance_preference,
        age_min_preference: updatedUser.age_min_preference,
        age_max_preference: updatedUser.age_max_preference,
        gender_preference: updatedUser.gender_preference
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get potential matches for current user
app.get('/api/discover', authenticateToken, async (req, res) => {
  try {
    const potentialMatches = await DatabaseUtils.getPotentialMatches(req.user.id, 10);
    res.json(potentialMatches);
  } catch (error) {
    console.error('Get potential matches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Like a user (create match)
app.post('/api/like/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId: likedUserId } = req.params;
    const currentUserId = req.user.id;

    // Check if users exist
    const currentUser = await User.findById(currentUserId);
    const likedUser = await User.findById(likedUserId);
    
    if (!currentUser || !likedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if match already exists
    const existingMatch = await Match.findByUsers(currentUserId, likedUserId);
    if (existingMatch) {
      return res.json({ message: 'Users are already matched', match: existingMatch });
    }

    // Create match
    const newMatch = await Match.create(currentUserId, likedUserId);

    res.status(201).json({
      message: 'User liked successfully',
      match: newMatch
    });
  } catch (error) {
    console.error('Like user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pass on a user (skip match)
app.post('/api/pass/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId: passedUserId } = req.params;
    const currentUserId = req.user.id;

    // In our implementation, passing just means not creating a match
    // We could add this to a "passed" table if needed for algorithm purposes
    res.json({ message: 'User passed' });
  } catch (error) {
    console.error('Pass user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's matches
app.get('/api/matches', authenticateToken, async (req, res) => {
  try {
    const matches = await Match.findByUserId(req.user.id);
    res.json(matches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's conversations
app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await DatabaseUtils.getUserConversations(req.user.id);
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages in a conversation
app.get('/api/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Verify that user has access to this conversation
    const convCheckQuery = `
      SELECT id FROM conversations 
      WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)
    `;
    const convCheckResult = await db.query(convCheckQuery, [conversationId, req.user.id]);
    
    if (convCheckResult.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const messages = await Message.findByConversationId(conversationId);
    
    // Mark messages as read
    await Message.markAsRead(conversationId, req.user.id);
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send a message
app.post('/api/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Message text is required' });
    }
    
    // Verify that user has access to this conversation
    const convCheckQuery = `
      SELECT id FROM conversations 
      WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)
    `;
    const convCheckResult = await db.query(convCheckQuery, [conversationId, req.user.id]);
    
    if (convCheckResult.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Create message
    const newMessage = await Message.create(conversationId, req.user.id, text);
    
    // Update conversation timestamp
    await db.query(`
      UPDATE conversations SET updated_at = NOW() WHERE id = $1
    `, [conversationId]);
    
    res.status(201).json({
      message: 'Message sent successfully',
      messageData: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new conversation (if doesn't exist) and send first message
app.post('/api/users/:userId/message', authenticateToken, async (req, res) => {
  try {
    const { userId: recipientId } = req.params;
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Message text is required' });
    }
    
    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }
    
    // Create or get existing conversation
    const conversationId = await DatabaseUtils.createConversation(req.user.id, recipientId);
    
    // Create message
    const newMessage = await Message.create(conversationId, req.user.id, text);
    
    res.status(201).json({
      message: 'Message sent successfully',
      conversationId,
      messageData: newMessage
    });
  } catch (error) {
    console.error('Send message to user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get events
app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT e.*, u.name as creator_name
      FROM events e
      JOIN users u ON e.creator_id = u.id
      ORDER BY e.date, e.time
      LIMIT 20
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create event
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;
    
    const eventId = generateId();
    const query = `
      INSERT INTO events (id, title, description, date, time, location, creator_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await db.query(query, [eventId, title, description, date, time, location, req.user.id]);
    
    res.status(201).json({
      message: 'Event created successfully',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join event
app.post('/api/events/:eventId/join', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Check if user is already attending
    const checkQuery = 'SELECT id FROM event_attendees WHERE event_id = $1 AND user_id = $2';
    const checkResult = await db.query(checkQuery, [eventId, req.user.id]);
    
    if (checkResult.rows.length > 0) {
      return res.json({ message: 'Already joined this event' });
    }
    
    // Add user to event
    const joinQuery = `
      INSERT INTO event_attendees (id, event_id, user_id, joined_at)
      VALUES ($1, $2, $3, NOW())
    `;
    await db.query(joinQuery, [generateId(), eventId, req.user.id]);
    
    res.json({ message: 'Joined event successfully' });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server and initialize database
async function startServer() {
  try {
    // Initialize database tables
    await DatabaseUtils.initializeTables();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`Lovara API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();

module.exports = app;