/**
 * pollController.js
 * 
 * This file contains controller functions for poll-related operations.
 * 
 * The controller functions handle HTTP requests to perform CRUD operations on polls.
 * 
 * Routes handled by this file:
 * - POST /api/polls           - Create a new poll.
 * - GET /api/polls/:pollId    - Get poll by ID.
 * - PUT /api/polls/:pollId    - Update poll details.
 * - DELETE /api/polls/:pollId - Delete a poll.
 * 
 * Dependencies:
 * - express:           A web framework used for handling HTTP requests.
 * - ../models/poll.js: Contains utility functions for interacting with Firestore to manage poll 
 *                      data.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { createPoll, getPollById, updatePoll, deletePollById } from '../models/poll.js';

/**
 * Controller to handle creating a new poll.
 * 
 * @param {Object} req - The request object, containing the poll's data in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code and the created poll data.
 */
export async function createPollController(req, res) {
    try {
        const { title, options, creatorId } = req.body;

        const pollData = { title, options, creatorId, createdAt: new Date() };
        const pollId = createPoll(pollData);

        res.status(201).json({
            message: 'Poll created successfully',
            pollId,
            pollData,
        });
    } catch (error) {
        console.error('Error creating poll:', error);
        res.status(500).json({
            message: 'Error creating poll',
        });
    }
}

/**
 * Controller to handle retrieving a poll by ID.
 * 
 * @param {Object} req - The request object, containing the poll ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code and the poll's data.
 */
export async function getPollByIdController(req, res) {
    try {
        const { pollId } = req.params;

        const pollData = await getPollById(pollId);

        if (pollData) {
            res.status(200).json(pollData);
        } else {
            res.status(404).json({
                message: 'Poll not found',
            });
        }
    } catch (error) {
        console.error('Error reading poll:', error);
        res.status(500).json({
            message: 'Error reading poll',
        });
    }
}

/**
 * Controller to handle updating a poll's data.
 * 
 * @param {Object} req - The request object, containing the poll ID in the params and updated data 
 *                       in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code and the updated poll's data.
 */
export async function updatePollController(req, res) {
    try {
        const { pollId } = req.params;
        const { updatedData } = req.body;

        updatePoll(pollId, updatedData);

        res.status(200).json({
            message: 'Poll updated successfully',
        });
    } catch (error) {
        console.error('Error updating poll:', error);
        res.status(500).json({
            message: 'Error updating poll',
        });
    }
}

/**
 * Controller to handle deleting a poll by ID.
 * 
 * @param {Object} req - The request object, containing the poll ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code.
 */
export async function deletePollByIdController(req, res) {
    try {
        const { pollId } = req.params;

        deletePollById(pollId);

        res.status(200).json({
            message: 'Poll deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting poll:', error);
        res.status(500).json({
            message: 'Error deleting poll',
        });
    }
}
