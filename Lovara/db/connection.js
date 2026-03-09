// Database connection setup for Lovara application
require('dotenv').config();
const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'lovara_db',
  username: process.env.DB_USER || 'lovara_user',
  password: process.env.DB_PASS || 'lovara_password',
  max: 10,
  min: 0,
  acquire: 30000,
  idle: 10000
};

class DatabaseConnection {
  constructor() {
    this.pool = new Pool({
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.username,
      password: dbConfig.password,
      max: dbConfig.max,
      min: dbConfig.min,
      acquire: dbConfig.acquire,
      idle: dbConfig.idle
    });

    // Test the connection
    this.testConnection();
  }

  async testConnection() {
    try {
      const client = await this.pool.connect();
      console.log('Connected to the database successfully');
      client.release();
    } catch (err) {
      console.error('Database connection failed:', err);
      console.log('Make sure PostgreSQL is running and the database exists');
    }
  }

  async query(text, params) {
    const start = Date.now();
    let res;
    try {
      res = await this.pool.query(text, params);
    } catch (err) {
      console.error('Database query error:', err);
      throw err;
    }
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = new DatabaseConnection();