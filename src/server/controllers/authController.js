/**
 * authController.js
 * 
 * This file contains the controller functions for handling user authentication requests.
 * It acts as an intermediary between the route definitions and the Firebase authentication 
 * functions.
 * 
 * Dependencies:
 * - ../middleware/auth/auth.js: Contains functions for user registration, login, and logout, 
 *                               utilizing Firebase Authentication.
 * 
 * The file exports functions that handle HTTP requests related to user authentication:
 * - register: Registers a new user with email and password.
 * - login:    Logs in a user with email and password.
 * - logout:   Logs out the current user.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { 
    registerUser, 
    loginUser, 
    logoutUser 
} from '../middleware/auth/auth.js';

/**
 * Registers a new user with email and password.
 * 
 * @param {Object} req - The request object containing the user's data in the body.
 * @param {Object} res - The response object used to send a response back to the client.
 * @returns {Promise<void>} Response with the status and user data.
 */
export async function register(req, res) {
    const { username, email, password } = req.body;

    try {
        const user = await registerUser(username, email, password);
        res.status(201).json({ 
            message: 'User registered successfully. A verification email has been sent to your' +
                'email address.',
            user,
        });
    } catch (error) {
        res.status(400).json({ 
            message: error.message,
        });
    }
}

/**
 * Logs in a user with email and password.
 * 
 * @param {Object} req - The request object containing the user's email and password in the body.
 * @param {Object} res - The response object used to send a response back to the client.
 * @returns {Promise<void>} Response with the status and user data.
 */
export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const { user, token } = await loginUser(email, password);

        res.cookie('authToken', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict', 
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful',
            user,
            token,
        });
    } catch (error) {
        if (error.message.includes('Email not verified')) {
            return res.status(403).json({
                message: error.message,
            });
        }
        res.status(400).json({ 
            message: error.message,
        });
    }
}

/**
 * Logs out the current user.
 * 
 * @param {Object} req - The request object (does not require body data).
 * @param {Object} res - The response object used to send a response back to the client.
 * @returns {Promise<void>} Response with the logout success message.
 */
export async function logout(req, res) {
    try {
        const message = await logoutUser();
        res.status(200).json({ 
            message, 
        });
    } catch (error) {
        res.status(400).json({ 
            message: error.message, 
        });
    }
}
