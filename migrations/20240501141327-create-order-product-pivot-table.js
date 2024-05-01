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
  return db.createTable('orders_products', {
    id : { type: 'int', unsigned: true, primaryKey: true, autoIncrement: true },
    status: { type:'string', length: 50, notNull: true, defaultValue: "Order placed" },
    quantity: { type:'int', unsigned: true, notNull: true },
    product_id: {
      type:'int', notNull: true, unsigned: true,
      foreignKey: {
        name: 'orders_products_product_fk',
        table: 'products',
        mapping: 'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    },
    order_id : {
      type:'int', notNull: true, unsigned: true, 
      foreignKey: {
        name: 'orders_products_order_fk',
        table:'orders',
        mapping:'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    }
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('orders_products', 'orders_products_product_fk');
  await db.removeForeignKey('orders_products', 'orders_products_order_fk');
  await db.dropTable('orders_products');
};

exports._meta = {
  "version": 1
};
