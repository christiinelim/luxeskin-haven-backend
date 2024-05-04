const { Admin } = require("../models");

const createAdmin = async (adminData) => {
    try {
        const newAdmin = new Admin ({
            ...adminData,
            created_at: new Date()
        });

        await newAdmin.save();
        return newAdmin
    } catch (error) {
        throw new Error(error)
    }  
}

const getAdminByEmail = async (email) => {
    try {
        const admin = await Admin
            .where({
                'email': email
            }).fetch({
                require: false
            })
        return admin
    } catch (error) {
        throw new Error(error)
    }
}

const updateVerificationStatus = async (adminId) => {
    try {
        const admin = await getAdminById(adminId);
        if (admin) {
            admin.set('verified', 'Yes');
            await admin.save();
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

const getAdminById = async (adminId) => {
    try {
        const admin = await Admin.where({
            'id': adminId,
        }).fetch({
            require: false
        })
        return admin
    } catch (error) {
        throw new Error(error)
    }
}

const updatePassword = async (email, password) => {
    try {
        const admin = await getAdminByEmail(email);
        if (admin) {
            admin.set('password', password);
            await admin.save();
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

const updateAdmin = async (adminId, updatedAdminData) => {
    try {
        const admin = await getAdminById(adminId);
        if (admin) {
            admin.set(updatedAdminData);
            await admin.save();
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

const deleteAdmin = async (adminId) => {
    try {
        const admin = await getAdminById(adminId);
        if (admin) {
            await admin.destroy();
            return true
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createAdmin,
    getAdminByEmail,
    updateVerificationStatus,
    getAdminById,
    updatePassword,
    updateAdmin,
    deleteAdmin
}