/**
 * topicController.js
 * 
 * This file contains controller functions for topic-related operations.
 * 
 * The controller functions handle HTTP requests to CRUD operations on topics.
 * 
 * Routes handled by this file:
 * - POST   /api/topics            - Create a new topic.
 * - GET    /api/topics            - Retrieve all topics.
 * - GET    /api/topics/:topicId   - Retrieve a topic by its unique ID.
 * - PUT    /api/topics/:topicId   - Update a topic's details.
 * - DELETE /api/topics/:topicId   - Delete a topic.
 * 
 * Dependencies:
 * - express:                                   Web framework used for handling HTTP requests.
 * - ../models/topic.js:                        Contains utility functions for interacting with 
 *                                              Firestore to manage topic data.
 * ../middleware/validations/pollValidation.js: Contains functions to validate poll data.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { 
    createTopic, 
    getAllTopics, 
    getTopicById, 
    updateTopic, 
    deleteTopicById 
} from '../models/topic.js';
import { validateName } from '../middleware/validations/topicValidation.js';

/**
 * Controller to handle creating a new topic.
 * 
 * @param {Object} req - The request object, containing the topic data in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function createTopicController(req, res) {
    try {
        const topicData = {
            ...req.body,
            name: req.body.name?.trim(),
        };

        const nameValidation = validateName(topicData.name);
        if (nameValidation.error) {
            return res.status(400).json({
                message: "Topic validation failed",
                errors: nameValidation.error.details.map((detail) => detail.message),
            });
        }

        const createdTopic = await createTopic(topicData);

        res.status(201).json({
            message: 'Topic created successfully',
            ...createdTopic,
        });
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({
            message: 'Failed to create topic',
        });
    }
}

/**
 * Controller to handle retrieving all topics.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function getAllTopicsController(req, res) {
    try {
        const topics = await getAllTopics();
        res.status(200).json(topics);
    } catch (error) {
        console.error('Error retrieving topics:', error);
        res.status(500).json({
            message: 'Failed to retrieve topics',
        });
    }
}

/**
 * Controller to handle retrieving a topic by ID.
 * 
 * @param {Object} req - The request object, containing the topic ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function getTopicByIdController(req, res) {
    try {
        const { topicId } = req.params;
        const topicData = await getTopicById(topicId);

        if (!topicData) {
            return res.status(404).json({
                message: 'Topic not found',
            });
        }

        res.status(200).json(topicData);
    } catch (error) {
        console.error('Error retrieving topic:', error);
        res.status(500).json({
            message: 'Failed to retrieve topic',
        });
    }
}

/**
 * Controller to handle updating a topic's data.
 * 
 * @param {Object} req - The request object, containing the topic ID in the params and updated 
 *                       data in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function updateTopicController(req, res) {
    try {
        const { topicId } = req.params;
        const updatedData = {
            ...req.body,
            name: req.body.name.trim(),
        }

        if (updatedData.name) {
            const nameValidation = validateName(topicData.name);
            if (nameValidation.error) {
                return res.status(400).json({
                    message: "Topic validation failed",
                    errors: nameValidation.error.details.map((detail) => detail.message),
                });
            }
        }

        await updateTopic(topicId, updatedData);

        res.status(200).json({
            message: 'Topic updated successfully',
            updatedData
        });
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({
            message: 'Failed to update topic',
        });
    }
}

/**
 * Controller to handle deleting a topic by ID.
 * 
 * @param {Object} req - The request object, containing the topic ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Promise<void>} A Promise resolving when the response is sent.
 */
export async function deleteTopicByIdController(req, res) {
    try {
        const { topicId } = req.params;

        const message = await deleteTopicById(topicId);
        if (message === 'Topic not found') {
            return res.status(404).json({
                message: message,
            });
        }

        res.status(200).json({
            message: 'Topic deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({
            message: 'Failed to delete topic',
        });
    }
}
