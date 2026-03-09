// Database utilities for Lovara application
const db = require('./connection');
const User = require('./models/User');
const Match = require('./models/Match');
const Message = require('./models/Message');

class DatabaseUtils {
  // Initialize database tables
  static async initializeTables() {
    try {
      // Create users table
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          age INTEGER,
          gender VARCHAR(50),
          bio TEXT,
          profile_pic_url VARCHAR(500),
          location JSONB,
          distance_preference INTEGER DEFAULT 50,
          age_min_preference INTEGER DEFAULT 18,
          age_max_preference INTEGER DEFAULT 50,
          gender_preference VARCHAR(50) DEFAULT 'all',
          is_active BOOLEAN DEFAULT TRUE,
          last_active TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create user_photos table
      await db.query(`
        CREATE TABLE IF NOT EXISTS user_photos (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          photo_url VARCHAR(500) NOT NULL,
          is_profile_photo BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create interests table
      await db.query(`
        CREATE TABLE IF NOT EXISTS interests (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL
        )
      `);

      // Create user_interests junction table
      await db.query(`
        CREATE TABLE IF NOT EXISTS user_interests (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          interest_id VARCHAR(36) REFERENCES interests(id) ON DELETE CASCADE
        )
      `);

      // Create matches table
      await db.query(`
        CREATE TABLE IF NOT EXISTS matches (
          id VARCHAR(36) PRIMARY KEY,
          user1_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          user2_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'matched',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create conversations table
      await db.query(`
        CREATE TABLE IF NOT EXISTS conversations (
          id VARCHAR(36) PRIMARY KEY,
          user1_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          user2_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create messages table
      await db.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id VARCHAR(36) PRIMARY KEY,
          conversation_id VARCHAR(36) REFERENCES conversations(id) ON DELETE CASCADE,
          sender_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          message_text TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create events table
      await db.query(`
        CREATE TABLE IF NOT EXISTS events (
          id VARCHAR(36) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          date DATE NOT NULL,
          time TIME NOT NULL,
          location VARCHAR(255) NOT NULL,
          creator_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          max_attendees INTEGER DEFAULT 100,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create event_attendees junction table
      await db.query(`
        CREATE TABLE IF NOT EXISTS event_attendees (
          id VARCHAR(36) PRIMARY KEY,
          event_id VARCHAR(36) REFERENCES events(id) ON DELETE CASCADE,
          user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create user_settings table
      await db.query(`
        CREATE TABLE IF NOT EXISTS user_settings (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          notification_likes BOOLEAN DEFAULT TRUE,
          notification_matches BOOLEAN DEFAULT TRUE,
          notification_messages BOOLEAN DEFAULT TRUE,
          notification_events BOOLEAN DEFAULT FALSE,
          privacy_show_me BOOLEAN DEFAULT TRUE,
          privacy_show_distance BOOLEAN DEFAULT TRUE,
          privacy_show_age BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create blocks table
      await db.query(`
        CREATE TABLE IF NOT EXISTS blocks (
          id VARCHAR(36) PRIMARY KEY,
          blocker_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          blocked_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create reports table
      await db.query(`
        CREATE TABLE IF NOT EXISTS reports (
          id VARCHAR(36) PRIMARY KEY,
          reporter_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          reported_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          reason VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Error initializing database tables:', error);
    }
  }

  // Get potential matches for a user
  static async getPotentialMatches(userId, limit = 10) {
    const user = await User.findById(userId);
    if (!user) return [];

    // Query to find potential matches based on preferences
    const query = `
      SELECT u.*, 
        ABS(u.age - $2) AS age_diff,
        (SELECT COUNT(*) FROM user_interests ui1 
         JOIN user_interests ui2 ON ui1.interest_id = ui2.interest_id 
         WHERE ui1.user_id = u.id AND ui2.user_id = $1) AS common_interests
      FROM users u
      LEFT JOIN matches m ON (m.user1_id = $1 AND m.user2_id = u.id) OR (m.user2_id = $1 AND m.user1_id = u.id)
      LEFT JOIN blocks b1 ON (b1.blocker_id = $1 AND b1.blocked_id = u.id)
      LEFT JOIN blocks b2 ON (b2.blocker_id = u.id AND b2.blocked_id = $1)
      WHERE u.id != $1
        AND u.is_active = TRUE
        AND m.id IS NULL  -- Not already matched
        AND b1.id IS NULL -- User not blocked by current user
        AND b2.id IS NULL -- User not blocked the current user
        AND ($3 = 'all' OR u.gender = $3)  -- Gender preference
        AND u.age BETWEEN $4 AND $5  -- Age range preference
        AND u.distance_preference >= $6  -- Distance preference (implement location-based filtering)
      ORDER BY common_interests DESC, age_diff ASC
      LIMIT $7
    `;

    const params = [
      userId,
      user.age || 25, // Default to 25 if no age
      user.gender_preference || 'all',
      user.age_min_preference || 18,
      user.age_max_preference || 50,
      user.distance_preference || 50,
      limit
    ];

    const result = await db.query(query, params);
    return result.rows;
  }

  // Create a conversation between two users
  static async createConversation(user1_id, user2_id) {
    // Check if conversation already exists
    const existingQuery = `
      SELECT id FROM conversations 
      WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)
    `;
    const existingResult = await db.query(existingQuery, [user1_id, user2_id]);
    
    if (existingResult.rows.length > 0) {
      return existingResult.rows[0].id;
    }

    // Create new conversation
    const query = `
      INSERT INTO conversations (id, user1_id, user2_id, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id
    `;
    const params = [
      require('crypto').randomUUID(),
      user1_id,
      user2_id
    ];

    const result = await db.query(query, params);
    return result.rows[0].id;
  }

  // Get user's conversations with latest message
  static async getUserConversations(userId) {
    const query = `
      SELECT 
        c.id as conversation_id,
        c.updated_at,
        CASE 
          WHEN c.user1_id = $1 THEN u2.name 
          ELSE u1.name 
        END as other_user_name,
        CASE 
          WHEN c.user1_id = $1 THEN u2.profile_pic_url 
          ELSE u1.profile_pic_url 
        END as other_user_avatar,
        m.message_text as last_message,
        m.sent_at as last_message_time,
        m.sender_id,
        (SELECT COUNT(*) FROM messages msg WHERE msg.conversation_id = c.id AND msg.is_read = FALSE AND msg.sender_id != $1) as unread_count
      FROM conversations c
      JOIN users u1 ON c.user1_id = u1.id
      JOIN users u2 ON c.user2_id = u2.id
      LEFT JOIN messages m ON m.conversation_id = c.id AND m.sent_at = (
        SELECT MAX(sent_at) FROM messages WHERE conversation_id = c.id
      )
      WHERE c.user1_id = $1 OR c.user2_id = $1
      ORDER BY c.updated_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

module.exports = DatabaseUtils;