/**
 * pollController.js
 * 
 * This file contains controller functions for poll-related operations.
 * 
 * The controller functions handle HTTP requests to perform CRUD operations on polls.
 * 
 * Routes handled by this file:
 * - POST   /api/polls                         - Create a new poll.
 * - GET    /api/polls/:pollId                 - Get poll by ID.
 * - PUT    /api/polls/:pollId                 - Update poll details.
 * - DELETE /api/polls/:pollId                 - Delete a poll.
 * - GET    /api/polls                         - Get all polls.
 * - GET    /api/polls/user/:userId            - Get all polls by a specific user.
 * - POST   /api/polls/:pollId/vote/:valueName - Increment the vote count for a specific poll value.
 * 
 * Dependencies:
 * - express:           A web framework used for handling HTTP requests.
 * - ../models/poll.js: Contains utility functions for interacting with Firestore to manage poll 
 *                      data.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { 
    createPoll, 
    getPollById, 
    updatePoll, 
    deletePollById, 
    getAllPolls, 
    getAllPollsByCreator,
    voteForPollValue
} from '../models/poll.js';

/**
 * Controller to handle creating a new poll.
 * 
 * @param {Object} req - The request object, containing the poll's data in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function createPollController(req, res) {
    try {
        const pollData = req.body;

        const formattedValues = {};
        pollData.values.forEach(value => {
            formattedValues[value] = 0;
        });

        const createdPoll = await createPoll({
            ...pollData,
            values: formattedValues,
        });

        res.status(201).json({
            message: 'Poll created successfully',
            ...createdPoll,
        });
    } catch (error) {
        console.error('Error creating poll:', error);
        res.status(500).json({ 
            message: 'Failed to create poll', 
        });
    }
}

/**
 * Controller to handle retrieving a poll by ID.
 * 
 * @param {Object} req - The request object, containing the poll ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
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
        console.error('Error retrieving poll:', error);
        res.status(500).json({ 
            message: 'Failed to retrieve poll', 
        });
    }
}

/**
 * Controller to handle updating a poll's data.
 * 
 * @param {Object} req - The request object, containing the poll ID in the params and updated data 
 *                       in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function updatePollController(req, res) {
    try {
        const { pollId } = req.params;
        const updatedData = req.body;

        const formatedUpdatedData = await updatePoll(pollId, updatedData);

        res.status(200).json({ 
            message: 'Poll updated successfully',
            ...formatedUpdatedData,
        });
    } catch (error) {
        console.error('Error updating poll:', error);
        res.status(500).json({ 
            message: 'Failed to update poll',
        });
    }
}

/**
 * Controller to handle deleting a poll by ID.
 * 
 * @param {Object} req - The request object, containing the poll ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function deletePollByIdController(req, res) {
    try {
        const { pollId } = req.params;

        const result = await deletePollById(pollId);

        if (result === 'Poll not found') {
            res.status(404).json({ 
                message: result,
            });
        } else {
            res.status(200).json({ 
                message: result, 
            });
        }
    } catch (error) {
        console.error('Error deleting poll:', error);
        res.status(500).json({ 
            message: 'Failed to delete poll', 
        });
    }
}

/**
 * Controller to handle retrieving all polls.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function getAllPollsController(req, res) {
    try {
        const polls = await getAllPolls();

        res.status(200).json(polls);
    } catch (error) {
        console.error('Error retrieving polls:', error);
        res.status(500).json({ 
            message: 'Failed to retrieve polls',
        });
    }
}

/**
 * Controller to handle retrieving all polls by a specific user.
 * 
 * @param {Object} req - The request object, containing the user ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function getPollsByCreatorController(req, res) {
    try {
        const { userId } = req.params;

        const polls = await getAllPollsByCreator(userId);

        res.status(200).json(polls);
    } catch (error) {
        console.error('Error retrieving user polls:', error);
        res.status(500).json({ 
            message: 'Failed to retrieve user polls', 
        });
    }
}

/**
 * Controller to handle voting for a poll value.
 * 
 * @param {Object} req - The request object, containing poll ID and value name.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function voteForPollValueController(req, res) {
    const { pollId, valueName } = req.params;

    try {
        const updatedPoll = await voteForPollValue(pollId, valueName);

        res.status(200).json({
            message: `Vote for '${valueName}' added successfully`,
            updatedPoll,
        });
    } catch (error) {
        console.error('Error voting for poll value:', error);
        res.status(500).json({
            message: 'Failed to vote for poll value',
        });
    }
}
