/**
 * topic.js
 * 
 * This file contains utility functions for interacting with the Firestore database for topic-related 
 * operations.
 * 
 * Functions include creating, retrieving, updating, and deleting topics in the Firestore database.
 * 
 * The file utilizes Firebase Admin SDK to interact with Firestore and performs operations based on
 * topic data.
 * 
 * Operations:
 * - createTopic:     Adds a new topic to the database.
 * - getAllTopics:    Retrieves all topics from the database.
 * - getTopicById:    Retrieves a topic by its unique ID.
 * - updateTopic:     Updates topic details in the database.
 * - deleteTopicById: Deletes a topic by its unique ID.
 * 
 * Dependencies:
 * - firebase-admin: Firebase Admin SDK to interact with Firestore.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { db } from '../firebase/firebase.js';

/**
 * Creates a new topic in the database.
 * 
 * @param {Object} topicData - The data of the topic to be created.
 * @returns {Promise<Object>} The newly created topic data with its unique ID.
 * @throws {Error} If the operation fails.
 */
export async function createTopic(topicData) {
    try {
        const topicRef = await db.collection('topics').add(topicData);
        const savedTopic = await topicRef.get();

        return {
            id: topicRef.id,
            ...savedTopic.data(),
        };
    } catch (error) {
        throw new Error('Failed to create topic');
    }
}

/**
 * Retrieves all topics from the collection.
 * 
 * @returns {Promise<Array<Object>>} Resolves with an array of all topic data.
 * @throws {Error} If the operation fails.
 */
export async function getAllTopics() {
    try {
        const topicsSnapshot = await db.collection('topics').get();
        const topics = [];

        topicsSnapshot.forEach((doc) => {
            topics.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        return topics;
    } catch (error) {
        throw new Error('Failed to retrieve topics');
    }
}

/**
 * Retrieves a topic from the database by its unique ID.
 * 
 * @param {string} topicId - The ID of the topic to be retrieved.
 * @returns {Promise<Object|null>} The topic data if found, otherwise null.
 * @throws {Error} If the operation fails.
 */
export async function getTopicById(topicId) {
    try {
        const topicDoc = await db.collection('topics').doc(topicId).get();

        if (topicDoc.exists) {
            return {
                id: topicId,
                ...topicDoc.data(),
            };
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Failed to retrieve topic');
    }
}

/**
 * Updates an existing topic's data in the database.
 * 
 * @param {string} topicId     - The ID of the topic to be updated.
 * @param {Object} updatedData - The updated topic data to be saved.
 * @returns {Promise<void>} Resolves if the update is successful.
 * @throws {Error} If the operation fails.
 */
export async function updateTopic(topicId, updatedData) {
    try {
        const topicRef = db.collection('topics').doc(topicId);
        await topicRef.update(updatedData);
    } catch (error) {
        throw new Error('Failed to update topic');
    }
}

/**
 * Deletes a topic from the database by its unique ID.
 * 
 * @param {string} topicId - The ID of the topic to be deleted.
 * @returns {Promise<string>} Resolves with a success message if the topic is deleted.
 * @throws {Error} If the operation fails.
 */
export async function deleteTopicById(topicId) {
    try {
        const topicRef = db.collection('topics').doc(topicId);
        const topicDoc = await topicRef.get();

        if (!topicDoc.exists) {
            return 'Topic not found';
        }

        await topicRef.delete();
        return 'Topic deleted successfully';
    } catch (error) {
        throw new Error('Failed to delete topic');
    }
}
