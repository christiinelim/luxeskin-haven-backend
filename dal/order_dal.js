const { Order, OrderProduct } = require("../models");

const createOrder = async (orderData) => {
    try {
        const newOrder = new Order ({
            ...orderData,
            created_at: new Date()
        });

        await newOrder.save();
        return newOrder
    } catch (error) {
        throw new Error(error)
    } 
}

const createOrderProductPivot = async (orderId, productData) => {
    try {
        const order = await Order.where({ id: orderId }).fetch();
        await order.products().attach({
            product_id: productData.id,
            quantity: productData.quantity
        });

    } catch (error) {
        throw new Error(error)
    } 
}

const getOrderById = async (orderId) => {
    try {
        const order = await Order.where({
            'id': orderId
        }).fetch({
            require: false
        });
        return order
    } catch (error) {
        throw new Error(error)
    } 
}

const getOrderByUser = async (userId) => {
    try {
        const orders = await Order.where({
            'user_id': userId
        }).fetchAll({
            require: false
        });
        return orders
    } catch (error) {
        throw new Error(error)
    } 
}

const updateOrderProductPivot = async (data) => {
    try {
        const order = await Order.where({ id: data.order_id }).fetch();
        await order.products().detach(data.product_id);

        await order.products().attach({
            product_id: data.product_id,
            status: data.status,
            quantity: data.quantity
        });

    } catch (error) {
        throw new Error(error)
    } 
}

const getOrderProductPivot = async (orderId) => {
    try {
        const orderProduct = await OrderProduct.where({ order_id: orderId }).fetchAll({
            withRelated: ['products', 'products.seller'],
            require: true
        });
        return orderProduct

    } catch (error) {
        console.log(error)
        throw new Error(error)
    } 
}

module.exports = {
    createOrder,
    createOrderProductPivot,
    getOrderById,
    getOrderByUser,
    updateOrderProductPivot,
    getOrderProductPivot
}