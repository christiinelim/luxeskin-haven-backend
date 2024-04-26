const { Product } = require("../models");

const createProduct = async (productData) => {
    try {
        const newProduct = new Product ({
            ...productData,
            created_at: new Date()
        });

        await newProduct.save();
        return newProduct
    } catch (error) {
        throw new Error(error)
    }  
}

const getProductById = async (productId) => {
    try {
        const product = await Product.where({
            'id': productId,
        }).fetch({
            withRelated: ['category', 'skin_types', 'seller'],
            require: false
        })
        return product
    } catch (error) {
        throw new Error(error)
    }
}

const getProductBySeller = async (sellerId) => {
    try {
        const product = await Product.where({
            'seller_id': sellerId,
        }).fetch({
            withRelated: ['category', 'skin_types'],
            require: false
        })
        return product
    } catch (error) {
        throw new Error(error)
    }
}

const deleteProduct = async (productId) => {
    try {
        const product = await getProductById(productId);
        if (product) {
            await product.destroy();
            return true
        }
        return false
    } catch (error) {
        throw new Error(error)
    }
}

const updateProduct = async (productId, productData) => {
    try {
        const product = await getProductById(productId);
        if (product) {
            product.set(productData);
            await product.save();
            return product;
        }
        return false
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createProduct,
    getProductById,
    getProductBySeller,
    deleteProduct,
    updateProduct
}