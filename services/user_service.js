const userDataLayer = require('../dal/user_dal');
const emailService = require('../services/email_service');
const tokenService = require('../services/token_service');
const { comparePasswords } = require('../utils');

const createUser = async (userData) => {
    try {
        const existingUser = await getUserByEmail(userData.email);

        if (!existingUser.error) {
            return { error: "Email is already registered with an account" };
        }
        
        const newUser = await userDataLayer.createUser(userData);
        const token = await emailService.sendTokenEmail(userData.email);
        await tokenService.createToken({
            'type': 'Verification',
            token,
            'user_id': newUser.id,
            'profile': 'User'
        });
        
        return newUser;
    } catch (error) {
        throw new Error(error)
    }
}

const getUserByEmail = async (email) => {
    try {
        const user = await userDataLayer.getUserByEmail(email);
        if (user) {
            return user.toJSON();
        }
        return { error: "Account does not exist" };
    } catch (error) {
        throw new Error(error)
    }
}

const updateVerificationStatus = async (userId) => {
    try {
        return await userDataLayer.updateVerificationStatus(userId);
    } catch (error) {
        throw new Error(error)
    }
}

const verifyUser = async (userEmail, tokenData) => {
    try {
        const tokenExists = await tokenService.getToken(tokenData);
        if (tokenExists) {
            const tokenResponse = tokenExists.toJSON();
            if (tokenResponse.expires_at > new Date()) {
                const response = await updateVerificationStatus(tokenData.user_id);
                if (response) {
                    await tokenService.deleteToken(tokenExists);
                    return "Account verified"
                }
                return { error: "Unable to verify as account does not exist" }; 
            }

            await tokenService.deleteToken(tokenExists);
            const token = await emailService.sendTokenEmail(userEmail);
            await tokenService.createToken({
                'type': 'Verification',
                token,
                'user_id': tokenData.user_id,
                'profile': 'User'
            });

            return { error: "Token has expired" }; 
        }
        return { error: "Invalid token" };
    } catch (error) {
        throw new Error(error)
    }
}

const getUserByEmailAndPassword = async (email, password) => {
    try {
        const user = await userDataLayer.getUserByEmail(email);

        if (!user) {
            return { error: "Wrong email or password" };
        } else {
            const passwordMatch = await comparePasswords(password, user.toJSON().password);
            if (passwordMatch) {
                if (user.toJSON().verified !== 'Yes') {
                    return { 
                        error: "Account not verified",
                        data: user.toJSON()
                    };
                }
                return user.toJSON();
            } 
            return { error: "Wrong email or password" };
        }
    } catch (error) {
        throw new Error(error)
    }
}

const initiatePasswordReset = async (email) => {
    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser.error) {
            return { error: "Account does not exist" }
        }

        const token = await emailService.sendTokenEmail(email);
        await tokenService.createToken({
            'type': 'Reset',
            token,
            'user_id': existingUser.id,
            'profile': 'User'
        });
        
        return { 
            id: existingUser.id,
            email: existingUser.email
        };
    } catch (error) {
        throw new Error(error)
    } 
};

const updatePassword = async (userEmail, password, tokenData) => {
    try {
        const tokenExists = await tokenService.getToken(tokenData);
        if (tokenExists) {
            const tokenResponse = tokenExists.toJSON();
            if (tokenResponse.expires_at > new Date()) {
                const response = await userDataLayer.updatePassword(userEmail, password);
                if (response) {
                    await tokenService.deleteToken(tokenExists);
                    return "Password update success"
                }
                return { error: "Unable to update password as account does not exist" }; 
            }

            await tokenService.deleteToken(tokenExists);
            const token = await emailService.sendTokenEmail(userEmail);
            await tokenService.createToken({
                'type': 'Reset',
                token,
                'user_id': tokenData.user_id,
                'profile': 'User'
            });

            return { error: "Token has expired" }; 
        }
        return { error: "Invalid token" };
    } catch (error) {
        throw new Error(error)
    }
}

const updateUser = async (userId, updatedUserData) => {
    try {
        const response = await userDataLayer.updateUser(userId, updatedUserData);
        if (response) {
            return updatedUserData
        }
        return { error: "Unable to update" }; 
    } catch (error) {
        throw new Error(error)
    }
}

const deleteUser = async (userId) => {
    try {
        const response = await userDataLayer.deleteUser(userId);
        if (response) {
            return "Account deleted successfully"
        }
        return { error: "Unable to delete account" }; 
    } catch (error) {
        throw new Error(error)
    }
}

const getUserById = async (userId) => {
    try {
        const response = await userDataLayer.getUserById(userId);
        if (response) {
            return response
        }
        return { error: "Account does not exist" }; 
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createUser,
    verifyUser,
    getUserByEmailAndPassword,
    initiatePasswordReset,
    updatePassword,
    updateUser,
    deleteUser,
    getUserById
}