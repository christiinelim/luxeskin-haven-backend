const { Category } = require("../models");

const getAllCategories = async () => {
    try {
        const categories = await Category.fetchAll({
            require: true
        });
        return categories
    } catch (error) {
        throw new Error(error)
    } 
}

module.exports = {
    getAllCategories
}