import config from './config';

import express from 'express';

import logger from './loaders/logger';

async function startServer() {
  const app = express();

  // Serve static files
  app.use(express.static('../public'));

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, err => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }
    logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
  });
}

startServer()