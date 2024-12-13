/**
 * authRoutes.js
 * 
 * This file contains the route definitions for authentication-related operations.
 * 
 * It handles HTTP requests for user authentication, including registration, login, and logout.
 * 
 * Routes handled by this file:
 * - POST /api/auth/register - Register a new user.
 * - POST /api/auth/login    - Login a user.
 * - POST /api/auth/logout   - Logout the current user.
 * 
 * Dependencies:
 * - express:                          Web framework used to define and manage HTTP routes.
 * - ../controllers/authController.js: Contains the controller functions for user authentication.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import express from 'express';
import { 
    register, 
    login, 
    logout 
} from '../controllers/authController.js';

const router = express.Router();

// Route for registering a new user
router.post('/auth/register', register);

// Route for loggin in a user
router.post('/auth/login', login);

// Route for logging out a user
router.post('/auth/logout', logout);

// Export the router to be used in other parts of the application
export default router;
