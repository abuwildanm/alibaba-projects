// Database utilities for Lovara application using SQLite
const { db, query, run } = require('../connection_sqlite');
const User = require('./models/User_sqlite');
const Match = require('./models/Match_sqlite');
const Message = require('./models/Message_sqlite');
const crypto = require('crypto');

class DatabaseUtils {
  // Get potential matches for a user
  static async getPotentialMatches(userId, limit = 10) {
    const user = await User.findById(userId);
    if (!user) return [];

    // Query to find potential matches based on preferences
    const sql = `
      SELECT u.*, 
        ABS(u.age - ?) AS age_diff
      FROM users u
      LEFT JOIN matches m ON (m.user1_id = ? AND m.user2_id = u.id) OR (m.user2_id = ? AND m.user1_id = u.id)
      LEFT JOIN blocks b1 ON (b1.blocker_id = ? AND b1.blocked_id = u.id)
      LEFT JOIN blocks b2 ON (b2.blocker_id = u.id AND b2.blocked_id = ?)
      WHERE u.id != ?
        AND u.is_active = 1
        AND m.id IS NULL  -- Not already matched
        AND b1.id IS NULL -- User not blocked by current user
        AND b2.id IS NULL -- User not blocked the current user
        AND (? = 'all' OR u.gender = ?)  -- Gender preference
        AND u.age BETWEEN ? AND ?  -- Age range preference
      ORDER BY age_diff ASC
      LIMIT ?
    `;

    const params = [
      user.age || 25, // For age_diff calculation
      userId, // For matches check
      userId, // For matches check
      userId, // For blocks check
      userId, // For blocks check
      userId, // Exclude current user
      user.gender_preference || 'all', // Gender preference
      user.gender_preference || 'all', // Gender preference
      user.age_min_preference || 18, // Min age
      user.age_max_preference || 50, // Max age
      limit // Limit
    ];

    return await query(sql, params);
  }

  // Create a conversation between two users
  static async createConversation(user1_id, user2_id) {
    // Check if conversation already exists
    const existingSql = `
      SELECT id FROM conversations 
      WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
    `;
    const existingResult = await query(existingSql, [user1_id, user2_id, user2_id, user1_id]);
    
    if (existingResult.length > 0) {
      return existingResult[0].id;
    }

    // Create new conversation
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO conversations (id, user1_id, user2_id, created_at, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    const params = [id, user1_id, user2_id];

    await run(sql, params);
    return id;
  }

  // Get user's conversations with latest message
  static async getUserConversations(userId) {
    const sql = `
      SELECT 
        c.id as conversation_id,
        c.updated_at,
        CASE 
          WHEN c.user1_id = ? THEN u2.name 
          ELSE u1.name 
        END as other_user_name,
        CASE 
          WHEN c.user1_id = ? THEN u2.profile_pic_url 
          ELSE u1.profile_pic_url 
        END as other_user_avatar,
        m.message_text as last_message,
        m.sent_at as last_message_time,
        m.sender_id,
        (SELECT COUNT(*) FROM messages msg WHERE msg.conversation_id = c.id AND msg.is_read = 0 AND msg.sender_id != ?) as unread_count
      FROM conversations c
      JOIN users u1 ON c.user1_id = u1.id
      JOIN users u2 ON c.user2_id = u2.id
      LEFT JOIN messages m ON m.conversation_id = c.id AND m.sent_at = (
        SELECT MAX(sent_at) FROM messages WHERE conversation_id = c.id
      )
      WHERE c.user1_id = ? OR c.user2_id = ?
      GROUP BY c.id
      ORDER BY c.updated_at DESC
    `;    
    
    return await query(sql, [userId, userId, userId, userId, userId]);
  }
}

module.exports = DatabaseUtils;