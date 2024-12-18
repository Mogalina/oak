/**
 * pollRoutes.js
 * 
 * This file contains the route definitions for poll-related operations.
 * 
 * It handles HTTP requests for CRUD operations on polls.
 * 
 * Routes handled by this file:
 * - POST   /api/polls              - Create a new poll.
 * - GET    /api/polls/:pollId      - Retrieve a poll by its unique ID.
 * - PUT    /api/polls/:pollId      - Update a poll's data.
 * - DELETE /api/polls/:pollId      - Delete a poll by its unique ID.
 * - GET    /api/polls              - Retrieve all polls.
 * - GET    /api/polls/user/:userId - Retrieve all polls by creator ID.
 * - POST   /api/polls/:pollId/vote/:valueName - Increment the vote count for a specific poll value.
 * 
 * Dependencies:
 * - express:                              Web framework used to define and manage HTTP routes.
 * - pollController:                       Contains the controller functions to perform poll 
 *                                         operations.
 * - ../middleware/auth/authMiddleware.js: Middleware for authenticating requests via JWT.
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
    getAllPollsController,
    getPollsByCreatorController,
    voteForPollValueController
} from '../controllers/pollController.js';
import { authenticate } from '../middleware/auth/authMiddleware.js';

// Initialize the router for poll routes
const router = express.Router();

// Route for creating a new poll
router.post('/polls', authenticate, createPollController);

// Route for retrieving a poll by its unique ID
router.get('/polls/:pollId', authenticate, getPollByIdController);

// Route for updating poll data based on poll ID
router.put('/polls/:pollId', authenticate, updatePollController);

// Route for deleting a poll based on poll ID
router.delete('/polls/:pollId', authenticate, deletePollByIdController);

// Route for retrieveing all polls
router.get('/polls', getAllPollsController);

// Route for retrieving all polls by creator ID
router.get('/polls/user/:userId', authenticate, getPollsByCreatorController);

// Route for incrementing the vote count for a specific poll value
router.post('/polls/:pollId/vote/:valueName', authenticate, voteForPollValueController);

// Export the router to be used in other parts of the application
export default router;
