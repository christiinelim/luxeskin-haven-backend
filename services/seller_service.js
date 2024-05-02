const sellerDataLayer = require('../dal/seller_dal');
const emailService = require('../services/email_service');
const tokenService = require('../services/token_service');
const { comparePasswords } = require('../utils');

const createSeller = async (sellerData) => {
    try {
        const existingSeller = await getSellerByEmail(sellerData.email);

        if (!existingSeller.error) {
            return { error: "Email is already registered with an account" };
        }
        
        const newSeller = await sellerDataLayer.createSeller(sellerData);
        const token = await emailService.sendTokenEmail(sellerData.email);
        await tokenService.createToken({
            'type': 'Verification',
            token,
            'seller_id': newSeller.id,
            'profile': 'Seller'
        });
        
        return newSeller;
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerByEmail = async (email) => {
    try {
        const seller = await sellerDataLayer.getSellerByEmail(email);
        if (seller) {
            return seller.toJSON();
        }
        return { error: "Account does not exist" };
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerByEmailAndPassword = async (email, password) => {
    try {
        const seller = await sellerDataLayer.getSellerByEmail(email);

        if (!seller) {
            return { error: "Wrong email or password" };
        } else {
            const passwordMatch = await comparePasswords(password, seller.toJSON().password);
            if (passwordMatch) {
                if (seller.toJSON().verified !== 'Yes') {
                    return { 
                        error: "Account not verified",
                        data: seller.toJSON()
                    };
                }
                return seller.toJSON();
            } 
            return { error: "Wrong email or password" };
        }
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

const verifySeller = async (sellerEmail, tokenData) => {
    try {
        const tokenExists = await tokenService.getToken(tokenData);
        if (tokenExists) {
            const tokenResponse = tokenExists.toJSON();
            if (tokenResponse.expires_at > new Date()) {
                const response = await updateVerificationStatus(tokenData.seller_id);
                if (response) {
                    await tokenService.deleteToken(tokenExists);
                    return "Account verified"
                }
                return { error: "Unable to verify as account does not exist" }; 
            }

            await tokenService.deleteToken(tokenExists);
            const token = await emailService.sendTokenEmail(sellerEmail);
            await tokenService.createToken({
                'type': 'Verification',
                token,
                'seller_id': tokenData.seller_id,
                'profile': 'Seller'
            });

            return { error: "Token has expired" }; 
        }
        return { error: "Invalid token" };
    } catch (error) {
        throw new Error(error)
    }
}

const initiatePasswordReset = async (email) => {
    try {
        const existingSeller = await getSellerByEmail(email);

        if (existingSeller.error) {
            return { error: "Account does not exist" }
        }

        const token = await emailService.sendTokenEmail(email);
        await tokenService.createToken({
            'type': 'Reset',
            token,
            'seller_id': existingSeller.id,
            'profile': 'Seller'
        });
        
        return { 
            id: existingSeller.id,
            email: existingSeller.email
        };
    } catch (error) {
        throw new Error(error)
    } 
};

const updatePassword = async (sellerEmail, password, tokenData) => {
    try {
        const tokenExists = await tokenService.getToken(tokenData);
        if (tokenExists) {
            const tokenResponse = tokenExists.toJSON();
            if (tokenResponse.expires_at > new Date()) {
                const response = await sellerDataLayer.updatePassword(sellerEmail, password);
                if (response) {
                    await tokenService.deleteToken(tokenExists);
                    return "Password update success"
                }
                return { error: "Unable to update password as account does not exist" }; 
            }

            await tokenService.deleteToken(tokenExists);
            const token = await emailService.sendTokenEmail(sellerEmail);
            await tokenService.createToken({
                'type': 'Reset',
                token,
                'seller_id': tokenData.seller_id,
                'profile': 'Seller'
            });

            return { error: "Token has expired" }; 
        }
        return { error: "Invalid token" };
    } catch (error) {
        throw new Error(error)
    }
}

const updateSeller = async (sellerId, updatedSellerData) => {
    try {
        const response = await sellerDataLayer.updateSeller(sellerId, updatedSellerData);
        if (response) {
            return updatedSellerData
        }
        return { error: "Unable to update" }; 
    } catch (error) {
        throw new Error(error)
    }
}

const deleteSeller = async (sellerId) => {
    try {
        const response = await sellerDataLayer.deleteSeller(sellerId);
        if (response) {
            return "Account deleted successfully"
        }
        return { error: "Unable to delete account" }; 
    } catch (error) {
        throw new Error(error)
    }
}

const getSellerById = async (sellerId) => {
    try {
        const response = await sellerDataLayer.getSellerById(sellerId);
        if (response) {
            return response
        }
        return { error: "Account does not exist" }; 
    } catch (error) {
        throw new Error(error)
    }
}

const getSellers = async () => {
    try {
        const response = await sellerDataLayer.getSellers();
        return response
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createSeller,
    getSellerByEmail,
    getSellerByEmailAndPassword,
    verifySeller,
    updateVerificationStatus,
    initiatePasswordReset,
    updatePassword,
    updateSeller,
    deleteSeller,
    getSellerById,
    getSellers
}