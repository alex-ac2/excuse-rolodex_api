const config = require('../config');

const { host, database, port, user, password } = config.postgressDatabase;


const { Pool } = require('pg')
const pool = new Pool({
  host,
  user,
  password,
  database,
  port,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}