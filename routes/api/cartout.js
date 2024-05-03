const express = require('express');
const router = express.Router();

const { authenticateWithJWT } = require('../../middlewares');
const cartServices = require('../../services/cart_service');
const productServices = require('../../services/product_service');
const orderServices = require('../../services/order_service');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', authenticateWithJWT, async (req, res) => {
    try {
        const { user_id, name, address, items } = req.body;

        const lineItems = items.map((item) => ({
            quantity: item.quantity,
            price_data: {
                currency: 'SGD',
                unit_amount: Math.round(item.product.cost * 100),
                product_data: {
                    name: item.product.name,
                    images: [item.product.image],
                    metadata: {
                        product_id: item.product.id,
                        cart_id: item.id,
                        quantity: item.quantity,
                        cost: item.product.cost
                    }
                }
            }
        }));

        const payment = {
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            metadata: {
                user_id: user_id,
                name: name,
                address: address
            }
        }

        const paymentSession = await Stripe.checkout.sessions.create(payment);

        res.json({ sessionId: paymentSession.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/webhooks', async (req, res) => {
    const payload = req.body;
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET

    const sigHeader = req.headers['stripe-signature'];

    let event = null;

    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

        if (event.type == 'checkout.session.completed') {
            const stripeSession = event.data.object;
            
            const session = await Stripe.checkout.sessions.retrieve(
                stripeSession.id, {
                    expand: ['line_items']
                }
            );


            const lineItems = await Stripe.checkout.sessions.listLineItems(stripeSession.id, {
                expand: ['data.price', 'data.price.product']
            });

            let products = [];

            for (const item of lineItems.data) {
                const productId = item.price.product.id;
                const product = await Stripe.products.retrieve(productId);
        
                const productObject = {
                    id: parseInt(product.metadata.product_id),
                    quantity: parseInt(product.metadata.quantity)
                };
                products.push(productObject);

                // delete from cart
                await cartServices.deleteCartItem(product.metadata.cart_id);

                const purchasedQuantity = item.quantity;
                const purchasedProductId = parseInt(product.metadata.product_id);

                // update product stock
                await productServices.updateProductQuantity(purchasedProductId, purchasedQuantity);
            }
        
            // create order
            await orderServices.createOrder(products, { 
                user_id: session.metadata.user_id, 
                address: session.metadata.address,
                name: session.metadata.name,
                total_cost: (session.amount_total) / 100,
            });
                    
            res.json({ 'status': 'Success' })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
})

module.exports = router;