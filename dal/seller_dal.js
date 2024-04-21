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
        const seller = await Seller
            .where({
                'email': email
            }).fetch({
                require: false
            })
        return seller
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerByEmailAndPassword = async (email, password) => {
    try {
        const seller = await Seller
            .where({
                'email': email,
                'password': password
            }).fetch({
                require: false
            })
        return seller
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerById = async (sellerId) => {
    try {
        const seller = await Seller.where({
            'id': sellerId,
        }).fetch({
            require: false
        })
        return seller
    } catch (error) {
        throw new Error(error)
    }
}

const updateVerificationStatus = async (sellerId) => {
    try {
        const seller = await getSellerById(sellerId);
        if (seller) {
            seller.set('verified', 'Yes');
            await seller.save();
            return true;
        }
        return false;
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

// const updateSeller = async (sellerData) => {
    

//     cartItem.set('quantity', newQuantity);
//         await cartItem.save();
//         return true;
// }









module.exports = {
    createSeller,
    getSellerByEmail,
    getSellerByEmailAndPassword,
    updateVerificationStatus,
    getSellerById
}