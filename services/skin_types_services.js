const skinTypesDataLayer = require('../dal/skin_types_dal');

const attachSkinTypes = async (skinTypes, product) => {
    try {
        await skinTypesDataLayer.attachSkinTypes(skinTypes, product);
    } catch (error) {
        throw new Error(error)
    }
}

const updateSkinTypes = async (skinTypes, product) => {
    try {
        await skinTypesDataLayer.detachSkinTypes(product);
        await skinTypesDataLayer.attachSkinTypes(skinTypes, product);
    } catch (error) {
        throw new Error(error)
    }
}

const getAllSkinTypes = async () => {
    try {
        const response = await skinTypesDataLayer.getAllSkinTypes();
        return response
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    attachSkinTypes,
    updateSkinTypes,
    getAllSkinTypes
}