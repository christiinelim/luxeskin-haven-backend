const bookshelf = require('../bookshelf');

const Seller = bookshelf.model('Seller', {
    tableName: 'sellers'
})

const Token = bookshelf.model('Token', {
    tableName: 'tokens',
    sellers: function() {
        return this.hasMany('Seller');
    },
    users: function() {
        return this.hasMany('User');
    },
    admins: function() {
        return this.hasMany('Admin');
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken',{
    tableName:'blacklisted_tokens',
})

const Category = bookshelf.model('Category', {
    tableName: 'categories',
    products: function() {
        return this.hasMany('Product');
    }
})

const SkinType = bookshelf.model('SkinType', {
    tableName: 'skin_types',
    products: function() {
        return this.belongsToMany('Product');
    }
})

const Product = bookshelf.model('Product', {
    tableName: 'products',
    category: function() {
        return this.belongsTo('Category');
    },
    seller: function() {
        return this.belongsTo('Seller');
    },
    skin_types: function() {
        return this.belongsToMany('SkinType');
    },
    discount: function() {
        return this.belongsTo('Discount');
    },
    orders: function() {
        return this.belongsToMany('Order');
    }
})

const Discount = bookshelf.model('Discount', {
    tableName: 'discounts',
    products: function() {
        return this.belongsToMany('Product');
    }
})

const User = bookshelf.model('User', {
    tableName: 'users'
})

const CartItem = bookshelf.model('CartItem',{
    tableName:'cart_items',
    product:function() {
        return this.belongsTo('Product');
    },
    user: function() {
        return this.belongsTo('User');
    }
})

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    products: function() {
        return this.belongsToMany('Product');
    }
})

const OrderProduct = bookshelf.model('OrderProduct', {
    tableName: 'orders_products',
    orders: function() {
        return this.belongsTo('Order');
    },
    products: function() {
        return this.belongsTo('Product');
    },
})

const Admin = bookshelf.model('Admin', {
    tableName: 'admins'
})

const BlacklistedSeller = bookshelf.model('BlacklistedSeller', {
    tableName: 'blacklisted_sellers',
    sellers: function() {
        return this.belongsTo('Seller');
    }
})

module.exports = { 
    Seller, 
    Token, 
    BlacklistedToken,
    Category,
    SkinType,
    Product,
    Discount,
    User,
    CartItem,
    Order,
    OrderProduct,
    Admin,
    BlacklistedSeller
}