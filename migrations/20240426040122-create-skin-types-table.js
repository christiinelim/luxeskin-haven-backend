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
  return db.createTable('skin_types', {
    id: { type:'int', unsigned: true, autoIncrement: true, primaryKey: true },
    skin_type: { type:'string', length: 255, notNull: true }
  });
};

exports.down = function(db) {
  return db.dropTable('skin_types');
};

exports._meta = {
  "version": 1
};
