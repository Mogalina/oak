/**
 * topicRoutes.js
 * 
 * This file contains the route definitions for topic-related operations.
 * 
 * It handles HTTP requests for CRUD operations on topics.
 * 
 * Routes handled by this file:
 * - POST   /api/topics            - Create a new topic.
 * - GET    /api/topics            - Retrieve all topics.
 * - GET    /api/topics/:topicId   - Retrieve a topic by its unique ID.
 * - PUT    /api/topics/:topicId   - Update a topic's details.
 * - DELETE /api/topics/:topicId   - Delete a topic.
 * 
 * Dependencies:
 * - express:                              Web framework used to define and manage HTTP routes.
 * - topicController:                      Contains the controller functions to perform topic 
 *                                         operations.
 * - ../middleware/auth/authMiddleware.js: Middleware for authenticating requests via JWT.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import express from 'express';
import { 
    createTopicController, 
    getTopicByIdController,
    updateTopicController,
    deleteTopicByIdController,
    getAllTopicsController
} from '../controllers/topicController.js';
import { authenticate } from '../middleware/auth/authMiddleware.js';

// Initialize the router for topic routes
const router = express.Router();

// Route for retrieving all topics
router.get('/topics', authenticate, getAllTopicsController);

// Route for creating a new topic
router.post('/topics', authenticate, createTopicController);

// Route for retrieving a topic by its unique ID
router.get('/topics/:topicId', authenticate, getTopicByIdController);

// Route for updating topic data based on topic ID
router.put('/topics/:topicId', authenticate, updateTopicController);

// Route for deleting a topic based on topic ID
router.delete('/topics/:topicId', authenticate, deleteTopicByIdController);

// Export the router to be used in other parts of the application
export default router;
