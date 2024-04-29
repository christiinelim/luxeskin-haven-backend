const { User } = require("../models");

const createUser = async (userData) => {
    try {
        const newUser = new User ({
            ...userData,
            created_at: new Date()
        });

        await newUser.save();
        return newUser
    } catch (error) {
        throw new Error(error)
    }  
}

const getUserByEmail = async (email) => {
    try {
        const user = await User
            .where({
                'email': email
            }).fetch({
                require: false
            })
        return user
    } catch (error) {
        throw new Error(error)
    }
}

const updateVerificationStatus = async (userId) => {
    try {
        const user = await getUserById(userId);
        if (user) {
            user.set('verified', 'Yes');
            await user.save();
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

const getUserById = async (userId) => {
    try {
        const user = await User.where({
            'id': userId,
        }).fetch({
            require: false
        })
        return user
    } catch (error) {
        throw new Error(error)
    }
}

const updatePassword = async (email, password) => {
    try {
        const user = await getUserByEmail(email);
        if (user) {
            user.set('password', password);
            await user.save();
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

const updateUser = async (userId, updatedUserData) => {
    try {
        const user = await getUserById(userId);
        if (user) {
            user.set(updatedUserData);
            await user.save();
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

const deleteUser = async (userId) => {
    try {
        const user = await getUserById(userId);
        if (user) {
            await user.destroy();
            return true
        }
        return false;
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createUser,
    getUserByEmail,
    updateVerificationStatus,
    getUserById,
    updatePassword,
    updateUser,
    deleteUser
}