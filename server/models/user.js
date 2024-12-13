/**
 * user.js
 * 
 * This file contains utility functions for interacting with the Firestore database for user-related 
 * operations.
 * 
 * Functions include creating, retrieving, updating, and deleting users in the Firestore database.
 * 
 * The file utilizes Firebase Admin SDK to interact with Firestore and performs operations based on
 * user data.
 * 
 * Operations:
 * - getAllUsers:    Retrieves all users from the database.
 * - createUser:     Adds a new user to the database.
 * - getUserById:    Retrieves a user by their unique ID.
 * - updateUser:     Updates user data based on the provided user ID.
 * - deleteUserById: Deletes a user based on the provided user ID.
 * 
 * Dependencies:
 * - firebase-admin: Firebase Admin SDK to interact with Firestore.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import db from '../firebase/firebase.js';

/**
 * Retrieves all users from the collection.
 * 
 * @returns {Promise<Array<Object>>} Resolves with an array of all user data.
 * @throws {Error} If the operation fails.
 */
export async function getAllUsers() {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = [];

        usersSnapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        return users;
    } catch (error) {
        throw new Error('Failed to retrieve users');
    }
}

/**
 * Creates a new user in the database.
 * 
 * @param {Object} userData - The data of the user to be created.
 * @returns {Promise<Object>} The newly created user data with its ID.
 * @throws {Error} If the operation fails.
 */
export async function createUser(userData) {
    try {
        const topicsRefs = userRef.topics.map(id =>
            db.collection('topics').doc(id)
        );

        const formatedUserData = {
            ...userData,
            topics: topicsRefs,
        }

        const userRef = await db.collection('users').add(formatedUserData);

        const savedUser = await userRef.get();
        return {
            id: userRef.id,
            ...savedUser.data(),
        };
    } catch (error) {
        throw new Error('Failed to create user');
    }
}

/**
 * Retrieves a user from the collection by their unique ID.
 * 
 * @param {string} userId - The ID of the user to be retrieved.
 * @returns {Promise<Object|null>} The user data if found, otherwise null.
 * @throws {Error} If the operation fails.
 */
export async function getUserById(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            return {
                id: userId,
                ...userDoc.data(),
            };
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Failed to retrieve user');
    }
}

/**
 * Updates an existing user's data in the collection.
 * 
 * @param {string} userId      - The ID of the user to be updated.
 * @param {Object} updatedData - The updated user data to be saved.
 * @returns {Promise<void>} Resolves if the update is successful.
 * @throws {Error} If the operation fails.
 */
export async function updateUser(userId, updatedData) {
    try {
        const userRef = db.collection('users').doc(userId);

        if (updatedData.topics) {
            updatedData.topics = updatedData.topics.map(id =>
                db.collection('topics').doc(id)
            );
        }

        await userRef.update(updatedData);
    } catch (error) {
        throw new Error('Failed to update user');
    }
}

/**
 * Deletes a user from the collection by their unique ID.
 * 
 * @param {string} userId - The ID of the user to be deleted.
 * @returns {Promise<string>} Resolves with a success message if the user is deleted, or rejects 
 *                            with a message if the user does not exist.
 * @throws {Error} If the operation fails.
 */
export async function deleteUserById(userId) {
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return 'User not found';
        }

        await userRef.delete();
        return 'User deleted successfully';
    } catch (error) {
        throw new Error('Failed to delete user');
    }
}
