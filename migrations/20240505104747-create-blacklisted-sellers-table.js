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
  return db.createTable('blacklisted_sellers', {
    id: { primaryKey: true, type: 'int', unsigned: true, autoIncrement: true },
    created_at: { type:'datetime', notNull: true },
    reason: { type:'text', notNull: true },
    seller_id : {
      type: 'int', unsigned: true, 
      foreignKey: {
        name: 'blacklisted_sellers_sellers_fk',
        table:'sellers',
        mapping:'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    }
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('blacklisted_sellers', 'blacklisted_sellers_sellers_fk');
  await db.dropTable('blacklisted_sellers');
};

exports._meta = {
  "version": 1
};
