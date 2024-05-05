const BlacklistedSellersDataLayer = require('../dal/blacklisted_sellers_dal');

const getBlacklistedSellers = async () => {
    try {
        const blacklistedSellers = await BlacklistedSellersDataLayer.getBlacklistedSellers();
        return blacklistedSellers
    } catch (error) {
        throw new Error(error)
    }
}

const createBlacklistedSeller = async (data) => {
    try {
        await BlacklistedSellersDataLayer.createBlacklistedSeller(data);
    } catch (error) {
        throw new Error(error)
    }
}

const updateBlacklistedSeller = async (blacklistedId, data) => {
    try {
        const blacklistedSeller = await BlacklistedSellersDataLayer.updateBlacklistedSeller(blacklistedId, data);
        return blacklistedSeller
    } catch (error) {
        throw new Error(error)
    }
}

const deleteBlacklistedSeller = async (blacklistedId) => {
    try {
        await BlacklistedSellersDataLayer.deleteBlacklistedSeller(blacklistedId);
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