const { BlacklistedSeller } = require("../models");

const getBlacklistedSellers = async () => {
    try {
        const blacklistedSellers = await BlacklistedSeller.fetchAll({
                withRelated: ['sellers'],
                require: false
            });
        return blacklistedSellers
    } catch (error) {
        throw new Error(error)
    } 
}

const createBlacklistedSeller = async (data) => {
    try {
        const newBlacklistedSeller = new BlacklistedSeller ({
            ...data,
            created_at: new Date()
        });
        await newBlacklistedSeller.save();
    } catch (error) {
        throw new Error(error)
    } 
}

const updateBlacklistedSeller = async (blacklistedId, data) => {
    try {
        const blacklistedSeller = await getBlacklistedSellerById(blacklistedId);
        if (blacklistedSeller) {
            blacklistedSeller.set(data);
            await blacklistedSeller.save();
            return blacklistedSeller;
        }
        return false
    } catch (error) {
        throw new Error(error)
    } 
}

const deleteBlacklistedSeller = async (blacklistedId) => {
    try {
        const blacklistedSeller = await getBlacklistedSellerById(blacklistedId);
        if (blacklistedSeller) {
            await blacklistedSeller.destroy();
            return true
        }
        return false
    } catch (error) {
        throw new Error(error)
    }
}

const getBlacklistedSellerById = async (blacklistedId) => {
    try {
        const blacklistedSeller = await BlacklistedSeller.where({
            'id': blacklistedId,
        }).fetch({
            require: false
        })
        return blacklistedSeller
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    getBlacklistedSellers,
    createBlacklistedSeller,
    updateBlacklistedSeller,
    deleteBlacklistedSeller
}