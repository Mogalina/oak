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
 * - getTopicById:    Retrieves a topic by its unique ID.
 * - updateTopic:     Updates topic data based on the provided topic ID.
 * - deleteTopicById: Deletes a topic based on the provided topic ID.
 * 
 * Dependencies:
 * - firebase-admin: Firebase Admin SDK to interact with Firestore.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import db from '../firebase/firebase.js';

/**
 * Creates a new topic in the collection.
 * 
 * @param {Object} topicData - The data of the topic to be created.
 * @returns {string} The unique ID of the created topic.
 */
export async function createTopic(topicData) {
    try {
        const topicRef = await db.collection('topics').add(topicData);
        console.log('Topic created successfully');

        return topicRef.id;
    } catch (error) {
        console.error('Error creating topic:', error);
    }
}

/**
 * Retrieves a topic from the collection by its unique ID.
 * 
 * @param {string} topicId - The ID of the topic to be retrieved.
 * @returns {Object|null} The topic data if found, otherwise null if no topic is found.
 */
export async function getTopicById(topicId) {
    try {
        const topicDoc = await db.collection('topics').doc(topicId).get();
        if (topicDoc.exists) {
            console.log('Topic data:', topicDoc.data());
            return topicDoc.data();
        } else {
            console.log('Topic not found');
            return null;
        }
    } catch (error) {
        console.error('Error reading topic:', error);
    }
}

/**
 * Updates an existing topic's data in the collection.
 * 
 * @param {string} topicId     - The ID of the topic to be updated.
 * @param {Object} updatedData - The updated topic data to be saved.
 * @returns {void}
 */
export async function updateTopic(topicId, updatedData) {
    try {
        const topicRef = db.collection('topics').doc(topicId);
        await topicRef.update(updatedData);
        console.log('Topic updated successfully');
    } catch (error) {
        console.error('Error updating topic:', error);
    }
}

/**
 * Deletes a topic from the collection by its unique ID.
 * 
 * @param {string} topicId - The ID of the topic to be deleted.
 * @returns {void}
 */
export async function deleteTopicById(topicId) {
    try {
        await db.collection('topics').doc(topicId).delete();
        console.log('Topic deleted successfully');
    } catch (error) {
        console.error('Error deleting topic:', error);
    }
}
