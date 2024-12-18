/**
 * userController.js
 * 
 * This file contains controller functions for user-related operations.
 * 
 * The controller functions handle HTTP requests to CRUD operations on users.
 * 
 * Routes handled by this file:
 * - GET    /api/users         - Get all users.
 * - POST   /api/users         - Create a new user.
 * - GET    /api/users/:userId - Get user by ID.
 * - PUT    /api/users/:userId - Update user details.
 * - DELETE /api/users/:userId - Delete a user.
 * 
 * Dependencies:
 * - express:                                   A web framework used for handling HTTP requests.
 * - ../models/user.js:                         Contains utility functions for interacting with 
 *                                              Firestore to manage user data.
 * ../middleware/validations/userValidation.js: Contains functions to validate user data.
 * ../utils/passwordUtils.js:                   Contains utility functions for password hashing.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { 
    getAllUsers, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUserById, 
    checkUserExists 
} from '../models/user.js';
import { 
    validateUsername, 
    validateEmail, 
    validatePassword  
} from '../middleware/validations/userValidation.js';
import { hashPassword } from '../utils/passwordUtils.js';

/**
 * Controller to handle retrieving all users.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function getAllUsersController(req, res) {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({
            message: 'Failed to retrieve users',
        });
    }
}

/**
 * Controller to handle creating a new user.
 * 
 * @param {Object} req - The request object, containing the user's data in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function createUserController(req, res) {
    let userData = {
        ...req.body,
        username: req.body.username?.trim(),
        email: req.body.email?.trim(),
        password: req.body.password?.trim(),
    };

    const usernameValidation = validateUsername(userData.username);
    if (usernameValidation.error) {
        return res.status(400).json({
            message: "Username validation failed",
            errors: usernameValidation.error.details.map((detail) => detail.message),
        });
    }

    const emailValidation = validateEmail(userData.email);
    if (emailValidation.error) {
        return res.status(400).json({
            message: "Email validation failed",
            errors: emailValidation.error.details.map((detail) => detail.message),
        });
    }

    const passwordValidation = validatePassword(userData.password);
    if (passwordValidation.error) {
        return res.status(400).json({
            message: "Password validation failed",
            errors: passwordValidation.error.details.map((detail) => detail.message),
        });
    }

    try {
        const userExists = await checkUserExists(userData.username, userData.email);
        if (userExists.exists) {
            return res.status(400).json({
                message: userExists.message,
                field: userExists.field,
            });
        }

        const hashedPassword = await hashPassword(userData.password);
        userData = {
            ...userData,
            password: hashedPassword,
        };

        const createdUser = await createUser(userData);
        res.status(201).json({
            message: 'User created successfully',
            ...createdUser,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
}

/**
 * Controller to handle retrieving a user by ID.
 * 
 * @param {Object} req - The request object, containing the user ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function getUserByIdController(req, res) {
    const { userId } = req.params;

    try {
        const userData = await getUserById(userId);
        if (!userData) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({
            message: 'Failed to retrieve user',
        });
    }
}

/**
 * Controller to handle updating a user's data.
 * 
 * @param {Object} req - The request object, containing the user ID in the params and updated data 
 *                       in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function updateUserController(req, res) {
    const { userId } = req.params;
    let updatedData = {
        ...req.body,
        username: req.body.username?.trim(),
        email: req.body.email?.trim(),
        password: req.body.password?.trim(),
    };

    if (updatedData.username) {
        const usernameValidation = validateUsername(updatedData.username);
        if (usernameValidation.error) {
            return res.status(400).json({
                message: "Username validation failed",
                errors: usernameValidation.error.details.map((detail) => detail.message),
            });
        }
    }

    if (updatedData.email) {
        const emailValidation = validateEmail(updatedData.email);
        if (emailValidation.error) {
            return res.status(400).json({
                message: "Email validation failed",
                errors: emailValidation.error.details.map((detail) => detail.message),
            });
        }
    }

    if (updatedData.password) {
        const passwordValidation = validatePassword(updatedData.password);
        if (passwordValidation.error) {
            return res.status(400).json({
                message: "Password validation failed",
                errors: passwordValidation.error.details.map((detail) => detail.message),
            });
        }
    }

    try {
        const userExists = await checkUserExists(updatedData.username, updatedData.email);
        if (userExists.exists && userExists.field) {
            return res.status(400).json({
                message: userExists.message,
                field: userExists.field,
            });
        }

        if (updatedData.password) {
            const hashedPassword = await hashPassword(updatedData.password);
            updatedData = {
                ...updatedData,
                password: hashedPassword,
            };
        }

        await updateUser(userId, updatedData);
        res.status(200).json({
            message: 'User updated successfully',
            updatedData,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user' });
    }
}

/**
 * Controller to handle deleting a user by ID.
 * 
 * @param {Object} req - The request object, containing the user ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function deleteUserByIdController(req, res) {
    const { userId } = req.params;

    try {
        const message = await deleteUserById(userId);
        if (message === 'User not found') {
            return res.status(404).json({
                message: message,
            });
        }

        res.status(200).json({
            message,
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            message: 'Failed to delete user',
        });
    }
}
