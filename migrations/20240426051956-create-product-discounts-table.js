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
  return db.createTable('product_discounts', {
    id : { type: 'int', unsigned: true, primaryKey: true, autoIncrement: true },
    discount_percentage: { type: 'decimal(5,2)', unsigned: true, notNull: true },
    start_date: { type: 'date', notNull: true },
    end_date: { type: 'date', notNull: true },
    product_id: {
      type:'int', notNull: true, unsigned: true,
      foreignKey: {
        name: 'product_discounts_products_fk',
        table: 'products',
        mapping: 'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    }
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('product_discounts', 'product_discounts_products_fk');
  await db.dropTable('product_discounts');
};

exports._meta = {
  "version": 1
};
