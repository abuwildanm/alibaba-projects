// Message model for Lovara application
const db = require('../connection');

class Message {
  constructor(data) {
    this.id = data.id;
    this.conversation_id = data.conversation_id;
    this.sender_id = data.sender_id;
    this.message_text = data.message_text;
    this.is_read = data.is_read;
    this.sent_at = data.sent_at;
  }

  // Create a new message
  static async create(conversation_id, sender_id, message_text) {
    const query = `
      INSERT INTO messages (
        id, conversation_id, sender_id, message_text, is_read, sent_at
      ) VALUES ($1, $2, $3, $4, FALSE, NOW())
      RETURNING *
    `;
    const params = [
      require('crypto').randomUUID(),
      conversation_id,
      sender_id,
      message_text
    ];

    const result = await db.query(query, params);
    return new Message(result.rows[0]);
  }

  // Find messages by conversation ID
  static async findByConversationId(conversation_id) {
    const query = `
      SELECT m.*, u.name as sender_name, u.profile_pic_url as sender_profile_pic
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.sent_at ASC
    `;
    const result = await db.query(query, [conversation_id]);
    return result.rows.map(row => ({
      message: new Message(row),
      sender_info: { name: row.sender_name, profile_pic_url: row.sender_profile_pic }
    }));
  }

  // Mark messages as read
  static async markAsRead(conversation_id, user_id) {
    // Find the other participant in the conversation
    const convQuery = `
      SELECT user1_id, user2_id FROM conversations WHERE id = $1
    `;
    const convResult = await db.query(convQuery, [conversation_id]);
    
    if (convResult.rows.length === 0) return;
    
    const conv = convResult.rows[0];
    const otherUserId = conv.user1_id === user_id ? conv.user2_id : conv.user1_id;
    
    const query = `
      UPDATE messages 
      SET is_read = TRUE 
      WHERE conversation_id = $1 AND sender_id = $2 AND is_read = FALSE
    `;
    await db.query(query, [conversation_id, otherUserId]);
  }

  // Get latest message in a conversation
  static async getLatestMessage(conversation_id) {
    const query = `
      SELECT m.*, u.name as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.sent_at DESC
      LIMIT 1
    `;
    const result = await db.query(query, [conversation_id]);
    if (result.rows.length === 0) return null;
    return { message: new Message(result.rows[0]), sender_name: result.rows[0].sender_name };
  }
}

module.exports = Message;