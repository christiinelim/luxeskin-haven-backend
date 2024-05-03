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

const getOrderBySeller = async (sellerId) => {
    try {
        const orderProducts = await OrderProduct.collection()
            .query('whereIn', 'product_id', function() {
                this.select('id').from('products').where('seller_id', sellerId);
            })
            .fetch({
                withRelated: ['products', 'orders']
            });

        return orderProducts
    } catch (error) {
        throw new Error(error)
    } 
}

const updateOrderProductPivot = async (data) => {
    try {
        const orderProduct = await OrderProduct.where({
            'id': data.id
        }).fetch({
            required: true
        })

        orderProduct.set('status', data.status);
        orderProduct.save()

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
    getOrderBySeller,
    updateOrderProductPivot,
    getOrderProductPivot
}