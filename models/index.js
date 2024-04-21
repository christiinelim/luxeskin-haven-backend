const bookshelf = require('../bookshelf');

const Seller = bookshelf.model('Seller', {
    tableName: 'sellers'
})

const Token = bookshelf.model('Token', {
    tableName: 'tokens',
    sellers: function() {
        return this.hasMany('Seller');
    }
})

module.exports = { Seller, Token }