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

const BlacklistedToken = bookshelf.model('BlacklistedToken',{
    tableName:'blacklisted_tokens',
})

module.exports = { Seller, Token, BlacklistedToken }