const { CartItem } = require("../models");

const getCartItemsByUser = async (userId) => {
    try {
        const cartItems = await CartItem.where({
            'user_id': userId
        }).fetchAll({
            withRelated: [ 'product' ],
            require: false
        });
        return cartItems
    } catch (error) {
        throw new Error(error)
    } 
}

const getCartItemByUserAndProduct = async (userId, productId) => {
    try {
        const item = await CartItem.where({
            'user_id': userId,
            'product_id': productId
        }).fetch({
            require: false
        });
        return item

    } catch (error) {
        throw new Error(error)
    } 
}

const getCartItemById = async (cartId) => {
    try {
        const cartItem = await CartItem.where({
            'id': cartId
        }).fetch({
            require: false
        });
        return cartItem
    } catch (error) {
        throw new Error(error)
    } 
}

const addToCart = async (quantity, cartData) => {
    try {
        const newItem = new CartItem ({
            quantity,
            ...cartData
        });
        await newItem.save();
        return newItem

    } catch (error) {
        throw new Error(error)
    } 
}

const updateCartItem = async (quantity, cartData, cartItem) => {
    try {
        cartItem.set({
            ...cartData,
            quantity
        });
        await cartItem.save();
        return cartItem;

    } catch (error) {
        throw new Error(error)
    } 
}

const deleteCartItem = async (cartId) => {
    try {
        const cartItem = await getCartItemById(cartId);
        if (cartItem) {
            await cartItem.destroy();
            return true
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    getCartItemsByUser,
    getCartItemByUserAndProduct,
    getCartItemById,
    addToCart,
    updateCartItem,
    deleteCartItem
}