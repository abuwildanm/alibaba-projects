// Database connection setup for Lovara application using SQLite
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

let db;

// Initialize the database
async function initDb() {
  try {
    // Open the database (creates it if it doesn't exist)
    db = await open({
      filename: './lovara.db',
      driver: sqlite3.Database
    });

    console.log('Connected to SQLite database successfully');

    // Create tables if they don't exist
    await createTables();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

async function createTables() {
  // Create users table
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      bio TEXT,
      profile_pic_url TEXT,
      location TEXT,
      distance_preference INTEGER DEFAULT 50,
      age_min_preference INTEGER DEFAULT 18,
      age_max_preference INTEGER DEFAULT 50,
      gender_preference TEXT DEFAULT 'all',
      is_active BOOLEAN DEFAULT 1,
      last_active DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_photos table
  await db.run(`
    CREATE TABLE IF NOT EXISTS user_photos (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      photo_url TEXT NOT NULL,
      is_profile_photo BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create interests table
  await db.run(`
    CREATE TABLE IF NOT EXISTS interests (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    )
  `);

  // Create user_interests junction table
  await db.run(`
    CREATE TABLE IF NOT EXISTS user_interests (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      interest_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (interest_id) REFERENCES interests (id) ON DELETE CASCADE
    )
  `);

  // Create matches table
  await db.run(`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user1_id TEXT,
      user2_id TEXT,
      status TEXT DEFAULT 'matched',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (user2_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create conversations table
  await db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user1_id TEXT,
      user2_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (user2_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create messages table
  await db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      sender_id TEXT,
      message_text TEXT NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create events table
  await db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      time TIME NOT NULL,
      location TEXT NOT NULL,
      creator_id TEXT,
      max_attendees INTEGER DEFAULT 100,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create event_attendees junction table
  await db.run(`
    CREATE TABLE IF NOT EXISTS event_attendees (
      id TEXT PRIMARY KEY,
      event_id TEXT,
      user_id TEXT,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create user_settings table
  await db.run(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      notification_likes BOOLEAN DEFAULT 1,
      notification_matches BOOLEAN DEFAULT 1,
      notification_messages BOOLEAN DEFAULT 1,
      notification_events BOOLEAN DEFAULT 0,
      privacy_show_me BOOLEAN DEFAULT 1,
      privacy_show_distance BOOLEAN DEFAULT 1,
      privacy_show_age BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create blocks table
  await db.run(`
    CREATE TABLE IF NOT EXISTS blocks (
      id TEXT PRIMARY KEY,
      blocker_id TEXT,
      blocked_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (blocker_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (blocked_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create reports table
  await db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT,
      reported_id TEXT,
      reason TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (reported_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  console.log('All tables created successfully');
}

// Function to run queries
async function query(sql, params = []) {
  try {
    const result = await db.all(sql, params);
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
}

// Function to run insert/update/delete queries
async function run(sql, params = []) {
  try {
    const result = await db.run(sql, params);
    return result;
  } catch (err) {
    console.error('Database run error:', err);
    throw err;
  }
}

// Initialize the database when module is loaded
initDb();

module.exports = { db: () => db, query, run, initDb };