const sellerDataLayer = require('../dal/seller_dal');
const emailService = require('../services/email_service');
const tokenService = require('../services/token_service');

const createSeller = async (sellerData) => {
    try {
        const existingSeller = await getSellerByEmail(sellerData.email);

        if (existingSeller) {
            return { error: "Email is already registered with an account" };
        }
        
        const newSeller = await sellerDataLayer.createSeller(sellerData);
        const token = await emailService.sendTokenEmail(sellerData.email);
        await tokenService.createToken({
            'type': 'Verification',
            token,
            'seller_id': newSeller.id
        });
        
        return newSeller;
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerByEmail = async (email) => {
    try {
        return await sellerDataLayer.getSellerByEmail(email);
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerByEmailAndPassword = async (email, password) => {
    try {
        const seller = await sellerDataLayer.getSellerByEmailAndPassword(email, password);
        
        if (!seller) {
            return { error: "Wrong email or password" };
        } else if (seller.toJSON().verified !== 'Yes') {
            return { error: "Account not verified" };
        }
        return seller.toJSON();
    } catch (error) {
        throw new Error(error)
    }
}

const updateVerificationStatus = async (sellerId) => {
    try {
        return await sellerDataLayer.updateVerificationStatus(sellerId);
    } catch (error) {
        throw new Error(error)
    }
}

const verifyToken = async (sellerEmail, tokenData) => {
    try {
        const tokenExists = await tokenService.getTokenBySellerAndToken(tokenData);
        if (tokenExists) {
            const tokenResponse = tokenExists.toJSON();
            if (tokenResponse.expires_at > new Date()) {
                // destroy and set account to verified
                const response = await updateVerificationStatus(tokenData.seller_id);
                if (response) {
                    await tokenService.deleteToken(tokenExists);
                    return "Account verified"
                }
                return { error: "Unable to verify as account does not exist" }; 
            }

            // destroy and resend
            console.log("expire")
            await tokenService.deleteToken(tokenExists);
            const token = await emailService.sendTokenEmail(sellerEmail);
            await tokenService.createToken({
                'type': 'Verification',
                token,
                'seller_id': tokenData.seller_id
            });

            return { error: "Token has expired" }; 
        }
        return { error: "Invalid token" };
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createSeller,
    getSellerByEmail,
    getSellerByEmailAndPassword,
    verifyToken,
    updateVerificationStatus
}