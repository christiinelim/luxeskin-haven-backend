const discountDataLayer = require('../dal/discount_dal');
const productServices = require('../services/product_service')

const createDiscount = async (productId, discountData) => {
    try {        
        const newDiscount = await discountDataLayer.createDiscount(discountData);
        const product = await productServices.updateProductDiscount(productId, {discount_id: newDiscount.id});
        return newDiscount;
    } catch (error) {
        throw new Error(error)
    }
}

const getDiscountById = async (discountId) => {
    try {
        const response = await discountDataLayer.getDiscountById(discountId);
        if (response) {
            return response
        }
        return { error: "Discount does not exist" }; 
    } catch (error) {
        throw new Error(error)
    }
}

const deleteDiscount = async (discountId) => {
    try {
        const response = await discountDataLayer.deleteDiscount(discountId);
        if (response) {
            return response
        }
        return { error: "Discount does not exist" }
    } catch (error) {
        throw new Error(error)
    }
}

const updateDiscount = async (discountId, productId, discountData) => {
    try {
        const discount = await discountDataLayer.updateDiscount(discountId, discountData);
        if (discount) {
            // update the product to null by discount Id
            const oldProduct = await productServices.getProductByDiscountId(discountId);
            await productServices.updateProductDiscount(oldProduct.id, {discount_id: null});
            // update new product to id
            await productServices.updateProductDiscount(productId, {discount_id: discountId});
            return discount
        }
        
        return { error: "Discount does not exist" }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createDiscount,
    getDiscountById,
    deleteDiscount,
    updateDiscount
}