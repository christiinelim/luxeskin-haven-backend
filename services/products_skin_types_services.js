const productsSkinTypesDataLayer = require('../dal/products_skin_types_dal');

const attachSkinTypesToProducts = async (skinTypes, product) => {
    try {
        await productsSkinTypesDataLayer.attachSkinTypesToProducts(skinTypes, product);
    } catch (error) {
        throw new Error(error)
    }
}

const detachSkinTypesToProducts = () => {
    try {
        
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    attachSkinTypesToProducts,
    detachSkinTypesToProducts
}