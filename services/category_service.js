const CategoryDataLayer = require('../dal/category_dal');

const getAllCategories = async () => {
    try {
        const categories = await CategoryDataLayer.getAllCategories();
        return categories
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { 
    getAllCategories
}