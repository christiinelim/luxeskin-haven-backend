const express = require('express');
const router = express.Router();

const sellerServices = require('../services/seller_service');
const productServices = require('../services/product_service');
const blacklistedServices = require('../services/blacklisted_service');

// seller list
router.get('/sellers', async (req, res) => {
    try {
        const sellerData = await sellerServices.getSellers();

        res.render('landing', {
            sellers: sellerData.toJSON(),
            warning: {
                action: 'blacklist',
                message: 'By blacklisting, the seller will no longer have access to his/her account and his/her listings will no longer be on the platform.',
                header: 'Blacklist Seller'
            }
        });
    } catch (error) {
        console.log(error)
    }
   
})

// product list
router.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const productData = await productServices.getAllProducts(page);

        res.render('landing/products', {
            products: productData.toJSON(),
            warning: {
                action: 'delete',
                message: 'By deleting the product, it will be removed from all platforms and the seller will lose the listing.',
                header: 'Delete Product'
            },
            pagination: {
                pageCount: productData.pagination.pageCount,
                currentPage: page
            }
        });
    } catch (error) {
        console.log(error)
    } 
})

// delete product
router.delete('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        await productServices.deleteProduct(productId);
        req.flash('success_messages', 'Product has been successfully deleted')
    } catch (error) {
        console.log(error)
    }
});

// blacklist 
router.get('/blacklisted', async (req, res) => {
    try {
        console.log('redirected')
        const blacklistedSellers = await blacklistedServices.getBlacklistedSellers();
        res.render('landing/blacklisted', {
            blacklistedSellers: blacklistedSellers.toJSON(),
            warning: {
                action: 'undo blacklist for',
                message: 'By removing the blacklist, the seller will revert access to his/her account and his/her listings will be re-listed on the platform.',
                header: 'Undo Blacklisting'
            }
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/blacklisted', async (req, res) => {
    try {
        await blacklistedServices.createBlacklistedSeller(req.body);

        await sellerServices.updateSeller(req.body.seller_id, { blacklisted: "Yes" });
        req.flash('success_messages', 'Seller has been blacklisted');
        res.redirect('/blacklisted')
    } catch (error) {
        console.log(error)
    }
});

router.delete('/blacklisted/:blacklistedId/seller/:sellerId', async (req, res) => {
    try {
        const { blacklistedId, sellerId } = req.params
        await blacklistedServices.deleteBlacklistedSeller(blacklistedId);

        await sellerServices.updateSeller(sellerId, { blacklisted: "No" });
        req.flash('success_messages', 'Seller has been removed from the blacklist');
        res.redirect('/blacklisted')
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;