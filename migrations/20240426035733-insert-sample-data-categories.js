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
  await db.insert('categories', ['category'], ['Cleanser']);
  await db.insert('categories', ['category'], ['Toner']);
  await db.insert('categories', ['category'], ['Moisturiser']);
  await db.insert('categories', ['category'], ['Serum']);
  await db.insert('categories', ['category'], ['Sunscreen']);
  await db.insert('categories', ['category'], ['Mask']);
};

exports.down = async function(db) {
  await db.runSql('DELETE FROM categories WHERE category = ?', ['Cleanser']);
  await db.runSql('DELETE FROM categories WHERE category = ?', ['Toner']);
  await db.runSql('DELETE FROM categories WHERE category = ?', ['Moisturiser']);
  await db.runSql('DELETE FROM categories WHERE category = ?', ['Serum']);
  await db.runSql('DELETE FROM categories WHERE category = ?', ['Sunscreen']);
  await db.runSql('DELETE FROM categories WHERE category = ?', ['Mask']);
};

exports._meta = {
  "version": 1
};
