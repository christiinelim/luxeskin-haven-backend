const attachSkinTypesToProducts = async (skinTypes, product) => {
    try {
        await product.skin_types().attach(skinTypes.split(','));
    } catch (error) {
        throw new Error(error)
    }
}

const detachSkinTypesToProducts = async (skinTypes, product) => {
    try {
        await product.skin_types().detach(skinTypes.split(','));
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    attachSkinTypesToProducts,
    detachSkinTypesToProducts
}