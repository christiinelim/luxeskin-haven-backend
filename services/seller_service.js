const sellerDataLayer = require('../dal/seller_dal');
const emailService = require('../services/email_service');

const createSeller = async (sellerData) => {
    try {
        const existingSeller = await sellerDataLayer.getSellerByEmail(sellerData.email);

        if (existingSeller) {
            return { error: "Email is already registered with an account" };
        }

        const newSeller = await sellerDataLayer.createSeller(sellerData);
        await emailService.sendTokenEmail(sellerData.email);
        return newSeller;

    } catch (error) {
        throw new Error(error)
    }
}

const getSellerByEmail = async (email) => {
    try {
        return await sellerDataLayer.getSellerByEmail(email);
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerByEmailAndPassword = async (email, password) => {
    try {
        return await sellerDataLayer.getSellerByEmailAndPassword(email, password);
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createSeller,
    getSellerByEmail,
    getSellerByEmailAndPassword
}