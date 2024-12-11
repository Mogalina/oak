/**
 * topicController.js
 * 
 * This file contains controller functions for topic-related operations.
 * 
 * The controller functions handle HTTP requests to CRUD operations on topics.
 * 
 * Routes handled by this file:
 * - POST /api/topics            - Create a new topic.
 * - GET /api/topics/:topicId    - Retrieve a topic by its unique ID.
 * - PUT /api/topics/:topicId    - Update a topic's details.
 * - DELETE /api/topics/:topicId - Delete a topic.
 * 
 * Dependencies:
 * - express:            Web framework used for handling HTTP requests.
 * - ../models/topic.js: Contains utility functions for interacting with Firestore to manage 
 *                       topic data.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { createTopic, getTopicById, updateTopic, deleteTopicById } from '../models/topic.js';

/**
 * Controller to handle creating a new topic.
 * 
 * @param {Object} req - The request object, containing the topic data in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code and the created topic data.
 */
export async function createTopicController(req, res) {
    try {
        const { name, description } = req.body;

        const { topicId, topicData } = await createTopic({ name, description });

        res.status(201).json({
            message: 'Topic created successfully',
            topicId,
            topicData,
        });
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({
            message: 'Error creating topic',
        });
    }
}

/**
 * Controller to handle retrieving a topic by ID.
 * 
 * @param {Object} req - The request object, containing the topic ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code and the topic's data.
 */
export async function getTopicByIdController(req, res) {
    try {
        const { topicId } = req.params;

        const topicData = await getTopicById(topicId);

        res.status(200).json(topicData);
    } catch (error) {
        console.error('Error reading topic:', error);
        res.status(404).json({
            message: 'Topic not found',
        });
    }
}

/**
 * Controller to handle updating a topic's data.
 * 
 * @param {Object} req - The request object, containing the topic ID in the params and updated 
 *                       data in the body.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code and the updated topic's data.
 */
export async function updateTopicController(req, res) {
    try {
        const { topicId } = req.params;
        const { updatedData } = req.body;

        const updatedTopicData = await updateTopic(topicId, updatedData);

        res.status(200).json({
            message: 'Topic updated successfully',
            topicId,
            updatedTopicData,
        });
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({
            message: 'Error updating topic',
        });
    }
}

/**
 * Controller to handle deleting a topic by ID.
 * 
 * @param {Object} req - The request object, containing the topic ID in the params.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} The response with status code.
 */
export async function deleteTopicByIdController(req, res) {
    try {
        const { topicId } = req.params;

        const result = await deleteTopicById(topicId);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({
            message: 'Error deleting topic',
        });
    }
}
