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
  return db.createTable('orders', {
    id: { primaryKey: true, type: 'int', unsigned: true, autoIncrement: true },
    total_cost: { type:'decimal(10,2)', unsigned: true, notNull: true },
    created_at: { type: 'datetime', notNull: true },
    name: { type:'string', length: 100, notNull: true },
    address: { type:'string', length: 255, notNull: true },
    user_id: {
      type: 'int', unsigned: true, 
      foreignKey: {
        name: 'orders_users_fk',
        table:'users',
        mapping:'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    }
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('orders', 'orders_users_fk');
  await db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
