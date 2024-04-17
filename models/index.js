const bookshelf = require('../bookshelf');

const Vendor = bookshelf.model('Vendor', {
    tableName: 'vendors'
})

const Token = bookshelf.model('Token', {
    tableName: 'tokens',
    vendors: function() {
        return this.hasMany('Vendor');
    }
})

module.exports = { Vendor, Token }