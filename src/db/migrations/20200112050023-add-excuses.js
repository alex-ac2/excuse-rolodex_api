'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('excuses', {
    id: { type: 'string', primaryKey: true },
    caption: 'string',
    category: 'string',
    user_id: 'string',
    unique_rating: 'float',
    similar_caption_id: 'string',
    approved: 'boolean',
    rejected: 'boolean',
  });
};

exports.down = function(db) {
  return db.dropTable('excuses');
};

exports._meta = {
  "version": 1
};
