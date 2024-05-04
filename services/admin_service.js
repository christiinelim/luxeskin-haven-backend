const adminDataLayer = require('../dal/admin_dal');
const emailService = require('../services/email_service');
const tokenService = require('../services/token_service');
const { comparePasswords } = require('../utils');

const createAdmin = async (adminData) => {
    try {
        const existingAdmin = await getAdminByEmail(adminData.email);

        if (!existingAdmin.error) {
            return { error: "Email is already registered with an account" };
        }
        
        const newAdmin = await adminDataLayer.createAdmin(adminData);
        const token = await emailService.sendTokenEmail(adminData.email);
        await tokenService.createToken({
            'type': 'Verification',
            token,
            'admin_id': newAdmin.id,
            'profile': 'Admin'
        });
        
        return newAdmin;
    } catch (error) {
        throw new Error(error)
    }
}

const getAdminByEmail = async (email) => {
    try {
        const admin = await adminDataLayer.getAdminByEmail(email);
        if (admin) {
            return admin.toJSON();
        }
        return { error: "Account does not exist" };
    } catch (error) {
        throw new Error(error)
    }
}

const updateVerificationStatus = async (adminId) => {
    try {
        return await adminDataLayer.updateVerificationStatus(adminId);
    } catch (error) {
        throw new Error(error)
    }
}

const verifyAdmin = async (adminEmail, tokenData) => {
    try {
        const tokenExists = await tokenService.getToken(tokenData);
        if (tokenExists) {
            const tokenResponse = tokenExists.toJSON();
            if (tokenResponse.expires_at > new Date()) {
                const response = await updateVerificationStatus(tokenData.admin_id);
                if (response) {
                    await tokenService.deleteToken(tokenExists);
                    return "Account verified"
                }
                return { error: "Unable to verify as account does not exist" }; 
            }

            await tokenService.deleteToken(tokenExists);
            const token = await emailService.sendTokenEmail(adminEmail);
            await tokenService.createToken({
                'type': 'Verification',
                token,
                'admin_id': tokenData.admin_id,
                'profile': 'Admin'
            });

            return { error: "Token has expired, a new token has been sent" }; 
        }
        return { error: "Invalid token" };
    } catch (error) {
        throw new Error(error)
    }
}

const getAdminByEmailAndPassword = async (email, password) => {
    try {
        const admin = await adminDataLayer.getAdminByEmail(email);

        if (!admin) {
            return { error: "Wrong email or password" };
        } else {
            const passwordMatch = await comparePasswords(password, admin.toJSON().password);
            if (passwordMatch) {
                if (admin.toJSON().verified !== 'Yes') {
                    return { 
                        error: "Account not verified",
                        data: admin.toJSON()
                    };
                }
                return admin.toJSON();
            } 
            return { error: "Wrong email or password" };
        }
    } catch (error) {
        throw new Error(error)
    }
}

const initiatePasswordReset = async (email) => {
    try {
        const existingAdmin = await getAdminByEmail(email);

        if (existingAdmin.error) {
            return { error: "Account does not exist" }
        }

        const token = await emailService.sendTokenEmail(email);
        await tokenService.createToken({
            'type': 'Reset',
            token,
            'admin_id': existingAdmin.id,
            'profile': 'admin'
        });
        
        return { 
            id: existingAdmin.id,
            email: existingAdmin.email
        };
    } catch (error) {
        throw new Error(error)
    } 
};

const updatePassword = async (adminEmail, password, tokenData) => {
    try {
        const tokenExists = await tokenService.getToken(tokenData);
        if (tokenExists) {
            const tokenResponse = tokenExists.toJSON();
            if (tokenResponse.expires_at > new Date()) {
                const response = await adminDataLayer.updatePassword(adminEmail, password);
                if (response) {
                    await tokenService.deleteToken(tokenExists);
                    return "Password update success"
                }
                return { error: "Unable to update password as account does not exist" }; 
            }

            await tokenService.deleteToken(tokenExists);
            const token = await emailService.sendTokenEmail(adminEmail);
            await tokenService.createToken({
                'type': 'Reset',
                token,
                'admin_id': tokenData.admin_id,
                'profile': 'admin'
            });

            return { error: "Token has expired" }; 
        }
        return { error: "Invalid token" };
    } catch (error) {
        throw new Error(error)
    }
}

const updateAdmin = async (adminId, updatedAdminData) => {
    try {
        const response = await adminDataLayer.updateadmin(adminId, updatedAdminData);
        if (response) {
            return updatedAdminData
        }
        return { error: "Unable to update" }; 
    } catch (error) {
        throw new Error(error)
    }
}

const deleteAdmin = async (adminId) => {
    try {
        const response = await adminDataLayer.deleteAdmin(adminId);
        if (response) {
            return "Account deleted successfully"
        }
        return { error: "Unable to delete account" }; 
    } catch (error) {
        throw new Error(error)
    }
}

const getAdminById = async (adminId) => {
    try {
        const response = await adminDataLayer.getAdminById(adminId);
        if (response) {
            return response
        }
        return { error: "Account does not exist" }; 
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createAdmin,
    verifyAdmin,
    getAdminByEmailAndPassword,
    initiatePasswordReset,
    updatePassword,
    updateAdmin,
    deleteAdmin,
    getAdminById
}