const config = require('../config');

const { host, database, port, user, password } = config.postgressDatabase;

module.exports = {
  development: {
    driver: 'pg',
    filename: '~/dev.db',
    user: user,
    password: password,
    host: host,
    database: database,
    schema: 'my_schema',
    port: port,
  },

  pg: {
    driver: 'pg',
    user: user,
    password: password,
    host: host,
    database: database,
    schema: 'my_schema',
    port: port,
  },
};
