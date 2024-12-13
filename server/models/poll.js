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
 * - getAllPolls:          Retrieves all polls from the database.
 * - getAllPollsByCreator: Retrieves all polls created by a specific user.
 * - createPoll:           Adds a new poll to the database.
 * - getPollById:          Retrieves a poll by its unique ID.
 * - updatePoll:           Updates poll data based on the provided poll ID.
 * - deletePollById:       Deletes a poll based on the provided poll ID.
 * - voteForPollValue:     Increments the vote count for a specific poll value.
 * 
 * Dependencies:
 * - firebase-admin: Firebase Admin SDK to interact with Firestore.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/12
 */

import { db } from '../firebase/firebase.js';

/**
 * Retrieves all polls from the collection.
 * 
 * @returns {Promise<Object[]>} Resolves with an array of all poll data.
 * @throws {Error} If the operation fails.
 */
export async function getAllPolls() {
    try {
        const pollsSnapshot = await db.collection('polls').get();
        const polls = [];

        pollsSnapshot.forEach((doc) => {
            polls.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        return polls;
    } catch (error) {
        throw new Error('Failed to retrieve polls');
    }
}

/**
 * Retrieves all polls created by a specific user.
 * 
 * @param {string} userId - The ID of the user whose polls should be retrieved.
 * @returns {Promise<Object[]>} Resolves with an array of poll data.
 * @throws {Error} If the operation fails.
 */
export async function getAllPollsByCreator(userId) {
    try {
        const userRef = db.collection('users').doc(userId);

        const pollsSnapshot = await db.collection('polls').where('creator', '==', userRef).get();
        const polls = [];

        pollsSnapshot.forEach((doc) => {
            polls.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        return polls;
    } catch (error) {
        throw new Error('Failed to retrieve polls for user');
    }
}

/**
 * Creates a new poll in the collection.
 * 
 * @param {Object} pollData - The data of the poll to be created.
 * @returns {Promise<Object>} The newly created poll data with its ID.
 * @throws {Error} If the operation fails.
 */
export async function createPoll(pollData) {
    try {
        const creatorRef = db.collection('users').doc(pollData.creator);

        const topicsRefs = pollData.topics.map(id =>
            db.collection('topics').doc(id)
        );

        const formattedPollData = {
            ...pollData,
            creator: creatorRef,
            topics: topicsRefs,
        };

        const pollRef = await db.collection('polls').add(formattedPollData);
        const savedPoll = await pollRef.get();
        return {
            id: pollRef.id,
            ...savedPoll.data(),
        };
    } catch (error) {
        throw new Error('Failed to create poll');
    }
}

/**
 * Retrieves a poll from the collection by its unique ID.
 * 
 * @param {string} pollId - The ID of the poll to be retrieved.
 * @returns {Promise<Object|null>} The poll data if found, otherwise null.
 * @throws {Error} If the operation fails.
 */
export async function getPollById(pollId) {
    try {
        const pollDoc = await db.collection('polls').doc(pollId).get();
        if (pollDoc.exists) {
            return {
                id: pollId,
                ...pollDoc.data(),
            };
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Failed to retrieve poll');
    }
}

/**
 * Updates an existing poll's data in the collection.
 * 
 * @param {string} pollId      - The ID of the poll to be updated.
 * @param {Object} updatedData - The updated poll data to be saved.
 * @returns {Promise<Object>} The updated poll data with its ID.
 * @throws {Error} If the operation fails.
 */
export async function updatePoll(pollId, updatedData) {
    try {
        const pollRef = db.collection('polls').doc(pollId);

        if (updatedData.creator) {
            updatedData.creator = db.collection('users').doc(updatedData.creator);
        }

        if (updatedData.topics) {
            updatedData.topics = updatedData.topics.map(id =>
                db.collection('topics').doc(id)
            );
        }

        await pollRef.update(updatedData);

        const updatedPoll = await pollRef.get();
        return {
            id: pollId,
            ...updatedPoll.data(),
        };
    } catch (error) {
        throw new Error('Failed to update poll');
    }
}

/**
 * Deletes a poll from the collection by its unique ID.
 * 
 * @param {string} pollId - The ID of the poll to be deleted.
 * @returns {Promise<string>} Resolves with a success message if the poll is deleted, or rejects 
 *                            with a message if the poll does not exist.
 * @throws {Error} If the operation fails.
 */
export async function deletePollById(pollId) {
    try {
        const pollRef = db.collection('polls').doc(pollId);
        const pollDoc = await pollRef.get();

        if (!pollDoc.exists) {
            return 'Poll not found';
        }

        await pollRef.delete();
        return 'Poll deleted successfully';
    } catch (error) {
        throw new Error('Failed to delete poll');
    }
}

/**
 * Increments the vote count for a specific poll value.
 * 
 * @param {string} pollId    - The ID of the poll to vote on.
 * @param {string} valueName - The name of the value to vote for.
 * @returns {Promise<Object>} The updated poll data.
 * @throws {Error} If the operation fails.
 */
export async function voteForPollValue(pollId, valueName) {
    try {
        const pollRef = db.collection('polls').doc(pollId);
        const pollDoc = await pollRef.get();

        if (!pollDoc.exists) {
            throw new Error('Poll not found');
        }

        const pollData = pollDoc.data();
        let values = pollData.values;

        if (!values || typeof values !== 'object') {
            throw new Error(`Invalid values structure for poll: ${pollId}`);
        }

        if (!values.hasOwnProperty(valueName)) {
            throw new Error(`Value '${valueName}' not found in poll`);
        }

        values[valueName] = (values[valueName] || 0) + 1;

        await pollRef.update({ values });

        return {
            id: pollId,
            ...pollData,
            values,
        };
    } catch (error) {
        throw new Error('Failed to vote for poll value');
    }
}
