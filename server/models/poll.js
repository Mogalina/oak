/**
 * poll.js
 * 
 * This file contains utility functions for interacting with the Firestore database for poll-related 
 * operations.
 * 
 * Functions include creating, retrieving, updating, and deleting polls in the Firestore database.
 * 
 * The file utilizes Firebase Admin SDK to interact with Firestore and performs operations based on
 * poll data.
 * 
 * Operations:
 * - createPoll:     Adds a new poll to the database.
 * - getPollById:    Retrieves a poll by its unique ID.
 * - updatePoll:     Updates poll data based on the provided poll ID.
 * - deletePollById: Deletes a poll based on the provided poll ID.
 * 
 * Dependencies:
 * - firebase-admin: Firebase Admin SDK to interact with Firestore.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import db from '../firebase/firebase.js';

/**
 * Creates a new poll in the collection.
 * 
 * @param {Object} pollData - The data of the poll to be created.
 * @returns {string} The unique ID of the created poll.
 */
export async function createPoll(pollData) {
    try {
        const pollRef = await db.collection('polls').add(pollData);
        console.log('Poll created successfully');

        return pollRef.id;
    } catch (error) {
        console.error('Error creating poll:', error);
    }
}

/**
 * Retrieves a poll from the collection by its unique ID.
 * 
 * @param {string} pollId - The ID of the poll to be retrieved.
 * @returns {Object|null} The poll data if found, otherwise null if no poll is found.
 */
export async function getPollById(pollId) {
    try {
        const pollDoc = await db.collection('polls').doc(pollId).get();
        if (pollDoc.exists) {
            console.log('Poll data:', pollDoc.data());
            return pollDoc.data();
        } else {
            console.log('Poll not found');
            return null;
        }
    } catch (error) {
        console.error('Error reading poll:', error);
    }
}

/**
 * Updates an existing poll's data in the collection.
 * 
 * @param {string} pollId      - The ID of the poll to be updated.
 * @param {Object} updatedData - The updated poll data to be saved.
 * @returns {void}
 */
export async function updatePoll(pollId, updatedData) {
    try {
        const pollRef = db.collection('polls').doc(pollId);
        await pollRef.update(updatedData);
        console.log('Poll updated successfully');
    } catch (error) {
        console.log('Error updating poll:', error);
    }
}

/**
 * Deletes a poll from the collection by its unique ID.
 * 
 * @param {string} pollId - The ID of the poll to be deleted.
 * @returns {void}
 */
export async function deletePollById(pollId) {
    try {
        await db.collection('polls').doc(pollId).delete();
        console.log('Poll deleted successfully');
    } catch (error) {
        console.error('Error deleting poll:', error);
    }
}
