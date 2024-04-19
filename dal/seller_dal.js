const { Seller } = require("../models");

const createSeller = async (sellerData) => {
    try {
        const newSeller = new Seller ({
            ...sellerData,
            created_at: new Date()
        });

        await newSeller.save();
        return newSeller
    } catch (error) {
        throw new Error(error)
    }  
}

const getSellerByEmail = async (email) => {
    try {
        return await Seller.where({
                'email': email
            }).fetch({
                require: false
            })
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerByEmailAndPassword = async (email, password) => {
    try {
        return await Seller.where({
            'email': email,
            'password': password
        }).fetch({
            require: false
        })
    } catch (error) {
        throw new Error(error)
    }
}

const forgotPassword = async (email) => {
    try {
        const existingSeller = await getSellerByEmail(email);
        if (existingSeller) {
            return true
        } else {
            return 
        }
    } catch (error) {

    }


    // try {
    //     const cartItem = await getCartItemByUserAndProduct(userId, productId);
    // if (cartItem) {
    //     cartItem.set('quantity', newQuantity);
    //     await cartItem.save();
    //     return true;
    // }
    // return false;
    // }
}

const updateSeller = async (sellerData) => {
    

    cartItem.set('quantity', newQuantity);
        await cartItem.save();
        return true;
}









module.exports = {
    createSeller,
    getSellerByEmail,
    getSellerByEmailAndPassword
}