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
  return db.createTable('tokens', {
    id: { primaryKey: true, type: 'int', unsigned: true, autoIncrement: true },
    type: { type:'string', length: 320, notNull: true },
    token: { type: 'int', unsigned: true, length: 20, notNull: true },
    created_at: { type: 'datetime', notNull: true },
    expires_at: { type: 'datetime', notNull: true },
    vendor_id : {
      type: 'int', notNull: true, unsigned: true, 
      foreignKey: {
        name: 'tokens_vendors_fk',
        table:'vendors',
        mapping:'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    }
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('tokens', 'tokens_vendors_fk');
  await db.dropTable('tokens');
};

exports._meta = {
  "version": 1
};
