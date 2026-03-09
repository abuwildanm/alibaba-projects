// Match model for Lovara application
const db = require('../connection');

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
    const query = `
      INSERT INTO matches (
        id, user1_id, user2_id, status, created_at
      ) VALUES ($1, $2, $3, 'matched', NOW())
      RETURNING *
    `;
    const params = [
      require('crypto').randomUUID(),
      user1_id,
      user2_id
    ];

    const result = await db.query(query, params);
    return new Match(result.rows[0]);
  }

  // Find match by user IDs
  static async findByUsers(user1_id, user2_id) {
    const query = `
      SELECT * FROM matches 
      WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)
      AND status = 'matched'
    `;
    const result = await db.query(query, [user1_id, user2_id]);
    if (result.rows.length === 0) return null;
    return new Match(result.rows[0]);
  }

  // Find all matches for a user
  static async findByUserId(user_id) {
    const query = `
      SELECT m.*, u.name, u.profile_pic_url, u.bio
      FROM matches m
      JOIN users u ON (
        (m.user1_id = $1 AND m.user2_id = u.id) OR 
        (m.user2_id = $1 AND m.user1_id = u.id)
      )
      WHERE m.status = 'matched'
      ORDER BY m.created_at DESC
    `;
    const result = await db.query(query, [user_id]);
    return result.rows.map(row => ({ match: new Match(row), user: { name: row.name, profile_pic_url: row.profile_pic_url, bio: row.bio } }));
  }

  // Unmatch users
  async unmatch() {
    const query = 'UPDATE matches SET status = \'unmatched\' WHERE id = $1';
    await db.query(query, [this.id]);
  }
}

module.exports = Match;