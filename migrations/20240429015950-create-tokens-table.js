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
    type: { type:'string', length: 50, notNull: true },
    profile: { type:'string', length: 50, notNull: true },
    token: { type: 'int', unsigned: true, notNull: true },
    created_at: { type: 'datetime', notNull: true },
    expires_at: { type: 'datetime', notNull: true },
    seller_id : {
      type: 'int', unsigned: true, 
      foreignKey: {
        name: 'tokens_sellers_fk',
        table:'sellers',
        mapping:'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    },
    user_id : {
      type: 'int', unsigned: true, 
      foreignKey: {
        name: 'tokens_users_fk',
        table:'users',
        mapping:'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    }
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('tokens', 'tokens_sellers_fk');
  await db.removeForeignKey('tokens', 'tokens_users_fk');
  await db.dropTable('tokens');
};

exports._meta = {
  "version": 1
};
