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
  return db.createTable('products', {
    id: { type:'int', unsigned: true, autoIncrement: true, primaryKey: true },
    name: { type:'string', length: 255, notNull: true },
    availability: { type:'int', unsigned: true, notNull: true },
    cost: { type:'decimal(10,2)', unsigned: true, notNull: true },
    description: { type:'text', notNull: true },
    ingredients: { type:'text', notNull: true },
    refund_policy: { type:'text', notNull: true },
    discount: { type:'string', length: 20, notNull: true, defaultValue: "No" },
    seller_id : {
      type: 'int', notNull: true, unsigned: true, 
      foreignKey: {
        name: 'products_sellers_fk',
        table:'sellers',
        mapping:'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    },
    category_id : {
      type: 'int', notNull: true, unsigned: true, 
      foreignKey: {
        name: 'categories_products_fk',
        table:'categories',
        mapping:'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    }
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('products', 'products_sellers_fk');
  await db.removeForeignKey('products', 'categories_products_fk');
  await db.dropTable('products');
};

exports._meta = {
  "version": 1
};
