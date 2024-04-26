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

exports.up = async function(db) {
  await db.insert('skin_types', ['skin_type'], ['Oily']);
  await db.insert('skin_types', ['skin_type'], ['Dry']);
  await db.insert('skin_types', ['skin_type'], ['Combination']);
  await db.insert('skin_types', ['skin_type'], ['Sensitive']);
  await db.insert('skin_types', ['skin_type'], ['Acne-Prone']);
};

exports.down = async function(db) {
  await db.runSql('DELETE FROM skin_types WHERE skin_type = ?', ['Oily']);
  await db.runSql('DELETE FROM skin_types WHERE skin_type = ?', ['Dry']);
  await db.runSql('DELETE FROM skin_types WHERE skin_type = ?', ['Combination']);
  await db.runSql('DELETE FROM skin_types WHERE skin_type = ?', ['Sensitive']);
  await db.runSql('DELETE FROM skin_types WHERE skin_type = ?', ['Acne-Prone']);
};

exports._meta = {
  "version": 1
};
