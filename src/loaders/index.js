import expressLoader from './express';
// import postgresLoader from './postgres';
import logger from './logger';
// import db from '../db';

export default async ({ expressApp }) => {
  // const postgresConnection = await db();
  // logger.info('✌️ Postgress Knex connection loaded');

  await expressLoader({ app: expressApp });
  logger.info('✌️ Express loaded');
};
