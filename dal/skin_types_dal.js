const attachSkinTypes = async (skinTypes, product) => {
    try {
        await product.skin_types().attach(skinTypes.split(','));
    } catch (error) {
        throw new Error(error)
    }
}

const detachSkinTypes = async (product) => {
    try {
        const existingSkinTypesId = await product.related('skin_types').pluck('id');
        await product.skin_types().detach(existingSkinTypesId);
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    attachSkinTypes,
    detachSkinTypes
}