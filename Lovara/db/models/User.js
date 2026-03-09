// User model for Lovara application
const db = require('../connection');

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
    const query = `
      INSERT INTO users (
        id, name, email, password_hash, age, gender, bio, profile_pic_url, 
        location, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `;
    const params = [
      userData.id || require('crypto').randomUUID(),
      name,
      email,
      password_hash,
      age || null,
      gender || null,
      bio || null,
      profile_pic_url || null,
      location ? JSON.stringify(location) : null
    ];

    const result = await db.query(query, params);
    return new User(result.rows[0]);
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) return null;
    return new User(result.rows[0]);
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    if (result.rows.length === 0) return null;
    return new User(result.rows[0]);
  }

  // Update user
  async update(updateData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    values.push(this.id); // Last parameter for WHERE clause

    if (fields.length === 0) return this;

    const query = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;
    const result = await db.query(query, values);
    Object.assign(this, result.rows[0]);
    return this;
  }

  // Delete user
  async delete() {
    const query = 'DELETE FROM users WHERE id = $1';
    await db.query(query, [this.id]);
  }

  // Get user's matches
  async getMatches() {
    const query = `
      SELECT u.* FROM users u
      JOIN matches m ON (m.user1_id = $1 AND m.user2_id = u.id) OR (m.user2_id = $1 AND m.user1_id = u.id)
      WHERE m.status = 'matched'
    `;
    const result = await db.query(query, [this.id]);
    return result.rows.map(row => new User(row));
  }

  // Get user's conversations
  async getConversations() {
    const query = `
      SELECT c.*, u1.name as user1_name, u2.name as user2_name
      FROM conversations c
      JOIN users u1 ON c.user1_id = u1.id
      JOIN users u2 ON c.user2_id = u2.id
      WHERE c.user1_id = $1 OR c.user2_id = $1
      ORDER BY c.updated_at DESC
    `;
    const result = await db.query(query, [this.id]);
    return result.rows;
  }

  // Get user's events
  async getEvents() {
    const query = `
      SELECT e.* FROM events e
      JOIN event_attendees ea ON e.id = ea.event_id
      WHERE ea.user_id = $1
    `;
    const result = await db.query(query, [this.id]);
    return result.rows;
  }
}

module.exports = User;