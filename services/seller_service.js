const sellerDataLayer = require('../dal/seller_dal')

const createSeller = async (sellerData) => {
    try {
        const newSeller = await sellerDataLayer.createSeller(sellerData);   
        return newSeller
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerByEmail = async (email) => {
    try {
        const seller = await sellerDataLayer.getSellerByEmail(email);
        return seller
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerByEmailAndPassword = async (email, password) => {
    try {
        const foundSeller = await sellerDataLayer.getSellerByEmailAndPassword(email, password);
        return foundSeller
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createSeller,
    getSellerByEmail,
    getSellerByEmailAndPassword
}