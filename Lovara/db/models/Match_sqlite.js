// Match model for Lovara application using SQLite
const { db, query, run } = require('../../connection_sqlite');
const crypto = require('crypto');

class Match {
  constructor(data) {
    this.id = data.id;
    this.user1_id = data.user1_id;
    this.user2_id = data.user2_id;
    this.status = data.status;
    this.created_at = data.created_at;
  }

  // Create a new match
  static async create(user1_id, user2_id) {
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO matches (id, user1_id, user2_id, status, created_at)
      VALUES (?, ?, ?, 'matched', CURRENT_TIMESTAMP)
    `;
    const params = [id, user1_id, user2_id];

    await run(sql, params);
    
    // Get the created match
    const result = await query('SELECT * FROM matches WHERE id = ?', [id]);
    return new Match(result[0]);
  }

  // Find match by user IDs
  static async findByUsers(user1_id, user2_id) {
    const sql = `
      SELECT * FROM matches 
      WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
      AND status = 'matched'
    `;
    const result = await query(sql, [user1_id, user2_id, user2_id, user1_id]);
    if (result.length === 0) return null;
    return new Match(result[0]);
  }

  // Find all matches for a user
  static async findByUserId(user_id) {
    const sql = `
      SELECT m.*, u.name, u.profile_pic_url, u.bio
      FROM matches m
      JOIN users u ON (
        (m.user1_id = ? AND m.user2_id = u.id) OR 
        (m.user2_id = ? AND m.user1_id = u.id)
      )
      WHERE m.status = 'matched'
      ORDER BY m.created_at DESC
    `;
    const result = await query(sql, [user_id, user_id]);
    return result.map(row => ({ 
      match: new Match(row), 
      user: { 
        name: row.name, 
        profile_pic_url: row.profile_pic_url, 
        bio: row.bio 
      } 
    }));
  }

  // Unmatch users
  async unmatch() {
    const sql = 'UPDATE matches SET status = ? WHERE id = ?';
    await run(sql, ['unmatched', this.id]);
  }
}

module.exports = Match;