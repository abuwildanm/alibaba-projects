// User model for Lovara application using SQLite
const { db, query, run } = require('../../connection_sqlite');
const crypto = require('crypto');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.age = data.age;
    this.gender = data.gender;
    this.bio = data.bio;
    this.profile_pic_url = data.profile_pic_url;
    this.location = data.location;
    this.distance_preference = data.distance_preference;
    this.age_min_preference = data.age_min_preference;
    this.age_max_preference = data.age_max_preference;
    this.gender_preference = data.gender_preference;
    this.is_active = data.is_active;
    this.last_active = data.last_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const { name, email, password_hash, age, gender, bio, profile_pic_url, location } = userData;
    const id = userData.id || crypto.randomUUID();
    
    const sql = `
      INSERT INTO users (
        id, name, email, password_hash, age, gender, bio, profile_pic_url, 
        location, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    const params = [
      id,
      name,
      email,
      password_hash,
      age || null,
      gender || null,
      bio || null,
      profile_pic_url || null,
      location || null
    ];

    await run(sql, params);
    
    // Get the created user
    const result = await query('SELECT * FROM users WHERE id = ?', [id]);
    return new User(result[0]);
  }

  // Find user by ID
  static async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (result.length === 0) return null;
    return new User(result[0]);
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (result.length === 0) return null;
    return new User(result[0]);
  }

  // Update user
  async update(updateData) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return this;

    const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    values.push(this.id);
    
    await run(sql, values);
    
    // Refresh user data
    const result = await query('SELECT * FROM users WHERE id = ?', [this.id]);
    Object.assign(this, result[0]);
    return this;
  }

  // Delete user
  async delete() {
    const sql = 'DELETE FROM users WHERE id = ?';
    await run(sql, [this.id]);
  }

  // Get user's matches
  async getMatches() {
    const sql = `
      SELECT u.* FROM users u
      JOIN matches m ON (m.user1_id = ? AND m.user2_id = u.id) OR (m.user2_id = ? AND m.user1_id = u.id)
      WHERE m.status = 'matched'
    `;
    const result = await query(sql, [this.id, this.id]);
    return result.map(row => new User(row));
  }

  // Get user's conversations
  async getConversations() {
    const sql = `
      SELECT c.*, u1.name as user1_name, u2.name as user2_name
      FROM conversations c
      JOIN users u1 ON c.user1_id = u1.id
      JOIN users u2 ON c.user2_id = u2.id
      WHERE c.user1_id = ? OR c.user2_id = ?
      ORDER BY c.updated_at DESC
    `;
    return await query(sql, [this.id, this.id]);
  }

  // Get user's events
  async getEvents() {
    const sql = `
      SELECT e.* FROM events e
      JOIN event_attendees ea ON e.id = ea.event_id
      WHERE ea.user_id = ?
    `;
    return await query(sql, [this.id]);
  }
}

module.exports = User;