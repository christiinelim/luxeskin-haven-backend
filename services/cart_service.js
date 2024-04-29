const cartDataLayer = require('../dal/cart_dal');
const productServices = require('../services/product_service');

const getCartItemsByUser = async (userId) => {
    try {
        const cartItems = await cartDataLayer.getCartItemsByUser(userId);
        return cartItems
    } catch (error) {
        throw new Error(error)
    }
}

const addToCart = async (quantity, cartData) => {
    try {
        const product = await productServices.getProductById(cartData.product_id);

        const existingCartItem = await cartDataLayer.getCartItemByUserAndProduct(cartData.user_id, cartData.product_id);

        if (!existingCartItem) {
            if (product.toJSON().stocks_on_hand < quantity) {
                return { error: "Insufficient stock"}
            }

            const cartItem = await cartDataLayer.addToCart(quantity, cartData);
            return cartItem

        } else {
            const newQuantity = quantity + existingCartItem.toJSON().quantity

            if (product.toJSON().stocks_on_hand < newQuantity) {
                return { error: "Insufficient stock"}
            }

            const cartItem = await cartDataLayer.updateCartItem(newQuantity, cartData, existingCartItem);
            return cartItem
        }
        
    } catch (error) {
        throw new Error(error)
    }
}

const updateCartItem = async (cartId, quantity, cartData) => {
    try {
        const product = await productServices.getProductById(cartData.product_id);
        if (product.toJSON().stocks_on_hand < quantity) {
            return { error: "Insufficient stock"}
        }

        const existingCartItem = await cartDataLayer.getCartItemById(cartId);

        const cartItem = await cartDataLayer.updateCartItem(quantity, cartData, existingCartItem);
        return cartItem
    } catch (error) {
        throw new Error(error)
    }
}

const deleteCartItem = async (cartId) => {
    try {
        const response = await cartDataLayer.deleteCartItem(cartId);
        if (response) {
            return "Item deleted successfully"
        }
        return { error: "Cart item does not exist" }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { 
    getCartItemsByUser,
    addToCart,
    updateCartItem,
    deleteCartItem
}