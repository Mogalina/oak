/**
 * pollRoutes.js
 * 
 * This file contains the route definitions for poll-related operations.
 * 
 * It handles HTTP requests for CRUD operations on polls.
 * 
 * Routes handled by this file:
 * - POST /api/polls           - Create a new poll.
 * - GET /api/polls/:pollId    - Retrieve a poll by its unique ID.
 * - PUT /api/polls/:pollId    - Update a poll's data.
 * - DELETE /api/polls/:pollId - Delete a poll by its unique ID.
 * 
 * Dependencies:
 * - express:        Web framework used to define and manage HTTP routes.
 * - pollController: Contains the controller functions to perform poll operations.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import express from 'express';
import { 
    createPollController, 
    getPollByIdController,
    updatePollController,
    deletePollByIdController,
} from '../controllers/pollController.js';

// Initialize the router for poll routes
const router = express.Router();

// Route for creating a new poll
router.post('/polls', createPollController);

// Route for retrieving a poll by its unique ID
router.get('/polls/:pollId', getPollByIdController);

// Route for updating poll data based on poll ID
router.put('/polls/:pollId', updatePollController);

// Route for deleting a poll based on poll ID
router.delete('/polls/:pollId', deletePollByIdController);

// Export the router to be used in other parts of the application
export default router;
