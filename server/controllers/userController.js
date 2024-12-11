/**
 * userController.js
 * 
 * This file contains controller functions for user-related operations.
 * 
 * The controller functions handle HTTP requests to CRUD operations on users.
 * 
 * Routes handled by this file:
 * - POST /api/users           - Create a new user.
 * - GET /api/users/:userId    - Get user by ID.
 * - PUT /api/users/:userId    - Update user details.
 * - DELETE /api/users/:userId - Delete a user.
 * 
 * Dependencies:
 * - express:           A web framework used for handling HTTP requests.
 * - ../models/user.js: Contains utility functions for interacting with Firestore to manage user 
 *                      data.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { createUser, getUserById, updateUser, deleteUserById } from '../models/user.js';

/**
 * Controller to handle creating a new user.
 * 
 * @param {Object} req - The request object, containing the user's data in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code and the created user data.
 */
export async function createUserController(req, res) {
    try {
        const { username, email, password, topics } = req.body;

        const { userId, userData } = createUser({ username, email, password, topics });

        res.status(201).json({
            message: 'User created successfully',
            userId,
            userData,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Error creating user',
        });
    }
}

/**
 * Controller to handle retrieving a user by ID.
 * 
 * @param {Object} req - The request object, containing the user ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code and the user's data.
 */
export async function getUserByIdController(req, res) {
    try {
        const { userId } = req.params;

        const userData = await getUserById(userId);

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error reading user:', error);
        res.status(404).json({
            message: 'User not found',
        });
    }
}

/**
 * Controller to handle updating a user's data.
 * 
 * @param {Object} req - The request object, containing the user ID in the params and updated data 
 *                       in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code and the updated user's data.
 */
export async function updateUserController(req, res) {
    try {
        const { userId } = req.params;
        const { updatedData } = req.body;

        const updatedUserData = updateUser(userId, updatedData);

        res.status(200).json({
            message: 'User updated successfully',
            userId,
            updatedUserData,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            message: 'Error updating user',
        });
    }
}

/**
 * Controller to handle deleting a user by ID.
 * 
 * @param {Object} req - The request object, containing the user ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code.
 */
export async function deleteUserByIdController(req, res) {
    try {
        const { userId } = req.params;

        const result = deleteUserById(userId);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            message: 'Error deleting user',
        });
    }
}
