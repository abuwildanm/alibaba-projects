// Database configuration for Lovara application
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'lovara_db',
  username: process.env.DB_USER || 'lovara_user',
  password: process.env.DB_PASS || 'lovara_password',
  dialect: 'postgres', // Using PostgreSQL as example
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
};

module.exports = dbConfig;