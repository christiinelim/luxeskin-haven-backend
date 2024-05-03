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
            withRelated: ['category', 'skin_types', 'seller', 'discount'],
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
        }).fetchAll({
            withRelated: ['category', 'skin_types', 'discount'],
            require: false
        })
        return product
    } catch (error) {
        throw new Error(error)
    }
}

const getProductByDiscountId = async (discountId) => {
    try {
        const product = await Product.where({
            'discount_id': discountId,
        }).fetch({
            require: false
        })
        return product
    } catch (error) {
        throw new Error(error)
    }
}

const getAllProducts = async () => {
    try {
        const products = await Product.fetchAll({
            withRelated: ['category', 'skin_types', 'seller', 'discount'],
            require: true
        })
        return products
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

const updateProductQuantity = async (productId, quantityPurchased) => {
    try {
        const product = await getProductById(productId);
        if (product) {
            product.set({
                stocks_on_hand: product.toJSON().stocks_on_hand - quantityPurchased
            });
            await product.save();
        }
    } catch (error) {
        throw new Error(error)
    }
}

const searchProducts = async (queryBuilder) => {
    try {
        const products = await queryBuilder.fetch({
            withRelated: ['category', 'skin_types', 'seller', 'discount']
        });
        return products
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createProduct,
    getProductById,
    getProductBySeller,
    getProductByDiscountId,
    getAllProducts,
    deleteProduct,
    updateProduct,
    updateProductQuantity,
    searchProducts
}