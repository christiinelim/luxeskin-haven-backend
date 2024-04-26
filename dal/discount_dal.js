const { Discount } = require("../models");

const createDiscount = async (discountData) => {
    try {
        const newDiscount = new Discount ({
            ...discountData
        });

        await newDiscount.save();
        return newDiscount
    } catch (error) {
        throw new Error(error)
    }  
}

const getDiscountById = async (discountId) => {
    try {
        const discount = await Discount.where({
            'id': discountId,
        }).fetch({
            require: false
        })
        return discount
    } catch (error) {
        throw new Error(error)
    }
}

const deleteDiscount = async (discountId) => {
    try {
        const discount = await getDiscountById(discountId);
        if (discount) {
            await discount.destroy();
            return true
        }
        return false
    } catch (error) {
        throw new Error(error)
    }
}

const updateDiscount = async (discountId, discountData) => {
    try {
        const discount = await getDiscountById(discountId);
        if (discount) {
            discount.set(discountData);
            await discount.save();
            return discount;
        }
        return false
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