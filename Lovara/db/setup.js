// Database setup script for Lovara application
const { Pool } = require('pg');
require('dotenv').config();

// Configuration for connecting to PostgreSQL server (without specifying a database)
const serverConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'lovara_user',
  password: process.env.DB_PASS || 'lovara_password',
};

// Database name
const dbName = process.env.DB_NAME || 'lovara_db';

async function setupDatabase() {
  let serverPool;
  let dbPool;
  
  try {
    // Connect to the default postgres database to create our database
    serverPool = new Pool({
      ...serverConfig,
      database: 'postgres', // Connect to default postgres database
    });
    
    console.log('Connected to PostgreSQL server');
    
    // Check if database exists
    const dbExistsResult = await serverPool.query(`
      SELECT 1 FROM pg_catalog.pg_database WHERE datname = $1
    `, [dbName]);
    
    if (dbExistsResult.rowCount === 0) {
      // Database doesn't exist, create it
      console.log(`Database ${dbName} does not exist. Creating...`);
      
      // Note: database creation cannot be done in a transaction
      await serverPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
    
    // Close server pool connection
    await serverPool.end();
    
    // Now connect to the newly created database to create tables
    dbPool = new Pool({
      ...serverConfig,
      database: dbName,
    });
    
    console.log(`Connected to database ${dbName}`);
    
    // Create tables
    console.log('Creating tables...');
    
    // Create users table
    await dbPool.query(`
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
    console.log('Users table created');

    // Create user_photos table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS user_photos (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        photo_url VARCHAR(500) NOT NULL,
        is_profile_photo BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('User photos table created');

    // Create interests table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS interests (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      )
    `);
    console.log('Interests table created');

    // Create user_interests junction table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS user_interests (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        interest_id VARCHAR(36) REFERENCES interests(id) ON DELETE CASCADE
      )
    `);
    console.log('User interests table created');

    // Create matches table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id VARCHAR(36) PRIMARY KEY,
        user1_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        user2_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'matched',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Matches table created');

    // Create conversations table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR(36) PRIMARY KEY,
        user1_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        user2_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Conversations table created');

    // Create messages table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        conversation_id VARCHAR(36) REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        message_text TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Messages table created');

    // Create events table
    await dbPool.query(`
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
    console.log('Events table created');

    // Create event_attendees junction table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS event_attendees (
        id VARCHAR(36) PRIMARY KEY,
        event_id VARCHAR(36) REFERENCES events(id) ON DELETE CASCADE,
        user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Event attendees table created');

    // Create user_settings table
    await dbPool.query(`
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
    console.log('User settings table created');

    // Create blocks table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS blocks (
        id VARCHAR(36) PRIMARY KEY,
        blocker_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        blocked_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Blocks table created');

    // Create reports table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(36) PRIMARY KEY,
        reporter_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        reported_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        reason VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Reports table created');

    console.log('\nDatabase setup completed successfully!');
    console.log(`Database: ${dbName}`);
    console.log('All tables have been created.');
    
  } catch (error) {
    console.error('Error during database setup:', error);
  } finally {
    if (serverPool) {
      await serverPool.end();
    }
    if (dbPool) {
      await dbPool.end();
    }
  }
}

// Run the setup
setupDatabase();