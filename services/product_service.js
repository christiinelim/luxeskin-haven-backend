const productDataLayer = require('../dal/product_dal');
const productsSkinTypesServices = require('../services/products_skin_types_services')

const createProduct = async (skinTypes, productData) => {
    try {        
        const newProduct = await productDataLayer.createProduct(productData);
        await productsSkinTypesServices.attachSkinTypesToProducts(skinTypes, newProduct);
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


module.exports = {
    createProduct,
    getProductById,
    getProductBySeller,
    deleteProduct
}