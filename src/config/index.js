require('dotenv').config({ path: '../../.env' })
const dotenv = require('dotenv');
const fs = require('fs');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  /**
   * Sever listening port
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * JWT secret
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * Postgress Database Credentials
   */
  postgressDatabase: {
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
  },

  /**
   * Redis DataStore Credentials
   */
  redisDatabase: {
    host: process.env.REDIS_HOST,
    authPassword: process.env.REDIS_AUTH_PASSWORD,
    port: process.env.REDIS_PORT,
    sessionStoreSecret: process.env.REDIS_SESSION_STORE_SECRET,
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },  

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
}
