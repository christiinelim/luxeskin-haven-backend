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
  return db.addColumn('tokens', 'admin_id', {
    type: 'int',
    unsigned: true,
    foreignKey: {
      name: 'tokens_admins_fk',
      table: 'admins',
      mapping: 'id',
      rules: { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }
    }
  });
};

exports.down = function(db) {
  return db.removeForeignKey('tokens', 'tokens_admins_fk').then(function() {
    return db.removeColumn('tokens', 'admin_id');
  });
};

exports._meta = {
  "version": 1
};
