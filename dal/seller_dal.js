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
        const seller = await Seller .where({
            'email': email
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

const getSellers = async () => {
    try {
        const sellers = await Seller.fetchAll({
            require: false
        })
        return sellers
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

const updatePassword = async (email, password) => {
    try {
        const seller = await getSellerByEmail(email);
        if (seller) {
            seller.set('password', password);
            await seller.save();
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

const updateSeller = async (sellerId, updatedSellerData) => {
    try {
        const seller = await getSellerById(sellerId);
        if (seller) {
            seller.set(updatedSellerData);
            await seller.save();
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

const deleteSeller = async (sellerId) => {
    try {
        const seller = await getSellerById(sellerId);
        if (seller) {
            await seller.destroy();
            return true
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createSeller,
    getSellerByEmail,
    updateVerificationStatus,
    getSellerById,
    updatePassword,
    updateSeller,
    deleteSeller,
    getSellers
}