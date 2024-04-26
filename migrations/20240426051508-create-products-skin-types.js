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
  return db.createTable('products_skin_types', {
    id : { type: 'int', unsigned: true, primaryKey: true, autoIncrement: true },
    product_id: {
      type:'int', notNull: true, unsigned: true,
      foreignKey: {
        name: 'products_skin_types_product_fk',
        table: 'products',
        mapping: 'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    },
    skin_type_id : {
      type:'int', notNull:true, unsigned: true, 
      foreignKey: {
        name: 'products_skin_types_skin_type_fk',
        table:'skin_types',
        mapping:'id',
        rules: { onDelete: 'CASCADE', onUpdate:'RESTRICT'}
      }
    }
  });
};

exports.down = async function(db) {
  await db.removeForeignKey('products_skin_types', 'products_skin_types_product_fk' );
  await db.removeForeignKey('products_skin_types', 'products_skin_types_skin_type_fk');
  await db.dropTable('products_skin_types');
};

exports._meta = {
  "version": 1
};
