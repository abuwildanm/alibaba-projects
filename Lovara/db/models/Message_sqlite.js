// Message model for Lovara application using SQLite
const { db, query, run } = require('../../connection_sqlite');
const crypto = require('crypto');

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
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO messages (id, conversation_id, sender_id, message_text, is_read, sent_at)
      VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
    `;
    const params = [id, conversation_id, sender_id, message_text];

    await run(sql, params);
    
    // Get the created message
    const result = await query('SELECT * FROM messages WHERE id = ?', [id]);
    return new Message(result[0]);
  }

  // Find messages by conversation ID
  static async findByConversationId(conversation_id) {
    const sql = `
      SELECT m.*, u.name as sender_name, u.profile_pic_url as sender_profile_pic
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.sent_at ASC
    `;
    const result = await query(sql, [conversation_id]);
    return result.map(row => ({
      message: new Message(row),
      sender_info: { name: row.sender_name, profile_pic_url: row.sender_profile_pic }
    }));
  }

  // Mark messages as read
  static async markAsRead(conversation_id, user_id) {
    // Find the other participant in the conversation
    const convSql = `
      SELECT user1_id, user2_id FROM conversations WHERE id = ?
    `;
    const convResult = await query(convSql, [conversation_id]);
    
    if (convResult.length === 0) return;
    
    const conv = convResult[0];
    const otherUserId = conv.user1_id === user_id ? conv.user2_id : conv.user1_id;
    
    const sql = `
      UPDATE messages 
      SET is_read = 1 
      WHERE conversation_id = ? AND sender_id = ? AND is_read = 0
    `;
    await run(sql, [conversation_id, otherUserId]);
  }

  // Get latest message in a conversation
  static async getLatestMessage(conversation_id) {
    const sql = `
      SELECT m.*, u.name as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.sent_at DESC
      LIMIT 1
    `;
    const result = await query(sql, [conversation_id]);
    if (result.length === 0) return null;
    return { message: new Message(result[0]), sender_name: result[0].sender_name };
  }
}

module.exports = Message;