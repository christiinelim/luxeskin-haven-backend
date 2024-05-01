const orderDataLayer = require('../dal/order_dal');

const createOrder = async (products, orderData) => {
    try {
        const order = await orderDataLayer.createOrder(orderData);

        for (const product of products) {
            await createOrderProductPivot(order.toJSON().id, product);
        }

        return order
    } catch (error) {
        throw new Error(error)
    }
}

const createOrderProductPivot = async (orderId, productData) => {
    try {
        return await orderDataLayer.createOrderProductPivot(orderId, productData);
    } catch (error) {
        throw new Error(error)
    }
}

const getOrderById = async (orderId) => {
    try {
        return await orderDataLayer.getOrderById(orderId);
    } catch (error) {
        throw new Error(error)
    }
}

const getOrderByUser = async (userId) => {
    try {
        return await orderDataLayer.getOrderByUser(userId);
    } catch (error) {
        throw new Error(error)
    }
}

const updateOrderProductPivot = async (data) => {
    try {
        return await orderDataLayer.updateOrderProductPivot(data);
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { 
    createOrder,
    createOrderProductPivot,
    getOrderById,
    getOrderByUser,
    updateOrderProductPivot
}