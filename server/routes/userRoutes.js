/**
 * userRoutes.js
 * 
 * This file contains the route definitions for user-related operations.
 * 
 * It handles HTTP requests for CRUD operations on users.
 * 
 * Routes handled by this file:
 * - GET    /api/users         - Get all users.
 * - POST   /api/users         - Create a new user.
 * - GET    /api/users/:userId - Retrieve a user by their unique ID.
 * - PUT    /api/users/:userId - Update a user's data.
 * - DELETE /api/users/:userId - Delete a user by their unique ID.
 * 
 * Dependencies:
 * - express:                              Web framework used to define and manage HTTP routes.
 * - ../controllers/userController.js:     Contains the controller functions to perform user 
 *                                         operations.
 * - ../middleware/auth/authMiddleware.js: Middleware for authenticating requests via JWT.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import express from 'express';
import { 
    getAllUsersController,
    createUserController, 
    getUserByIdController,
    updateUserController,
    deleteUserByIdController,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth/authMiddleware.js';

// Initialize the router for user routes
const router = express.Router();

// Route for retrieving all users
router.get('/users', authenticate, getAllUsersController);

// Route for creating a new user
router.post('/users', createUserController);

// Route for retrieving a user by their unique ID
router.get('/users/:userId', authenticate, getUserByIdController);

// Route for updating user data based on user ID
router.put('/users/:userId', authenticate, updateUserController);

// Route for deleting a user based on user ID
router.delete('/users/:userId', authenticate, deleteUserByIdController);

// Export the router to be used in other parts of the application
export default router;
