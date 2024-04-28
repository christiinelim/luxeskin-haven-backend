const productDataLayer = require('../dal/product_dal');
const skinTypesServices = require('../services/skin_types_services')

const createProduct = async (skinTypes, productData) => {
    try {        
        const newProduct = await productDataLayer.createProduct(productData);
        await skinTypesServices.attachSkinTypes(skinTypes, newProduct);
        return newProduct;
    } catch (error) {
        throw new Error(error)
    }
}

const getProductById = async (productId) => {
    try {
        const response = await productDataLayer.getProductById(productId);
        if (response) {
            return response
        }
        return { error: "Product does not exist" }; 
    } catch (error) {
        throw new Error(error)
    }
}


const getProductBySeller = async (sellerId) => {
    try {
        const response = await productDataLayer.getProductBySeller(sellerId);
        if (response) {
            return response
        }
        return { error: "No products listed" }; 
    } catch (error) {
        throw new Error(error)
    }
}

const getProductByDiscountId = async (discountId) => {
    try {
        const response = await productDataLayer.getProductByDiscountId(discountId);
        if (response) {
            return response
        }
        return { error: "No product found" }; 
    } catch (error) {
        throw new Error(error)
    }
}

const getAllProducts = async () => {
    try {
        const response = await productDataLayer.getAllProducts();
        return response
    } catch (error) {
        throw new Error(error)
    }
}

const deleteProduct = async (productId) => {
    try {
        const response = await productDataLayer.deleteProduct(productId);
        if (response) {
            return response
        }
        return { error: "Product does not exist" }
    } catch (error) {
        throw new Error(error)
    }
}

const updateProduct = async (productId, skinTypes, productData) => {
    try {
        const product = await productDataLayer.updateProduct(productId, productData);
        if (product) {
            await skinTypesServices.updateSkinTypes(skinTypes, product);
            return product
        }
        
        return { error: "Product does not exist" }
    } catch (error) {
        throw new Error(error)
    }
}

const updateProductDiscount = async (productId, discountData) => {
    try {
        const product = await productDataLayer.updateProduct(productId, discountData);        
        return product
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
    updateProductDiscount
}