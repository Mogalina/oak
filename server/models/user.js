/**
 * user.js
 * 
 * This file contains utility functions for interacting with the Firestore database for user-related 
 * operations.
 * 
 * Functions include creating, retrieving, updating, and deleting users in the Firestore database.
 * 
 * Operations:
 * - getAllUsers:     Retrieves all users from the database.
 * - createUser:      Adds a new user to the database.
 * - getUserById:     Retrieves a user by their unique ID.
 * - updateUser:      Updates user data based on the provided user ID.
 * - deleteUserById:  Deletes a user based on the provided user ID.
 * - checkUserExists: Checks if a username or email already exists in the database.
 * 
 * Dependencies:
 * - firebase-admin: Firebase Admin SDK to interact with Firestore.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { db } from '../firebase/firebase.js';

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
        const topicsRefs = userData.topics.map(id =>
            db.collection('topics').doc(id)
        );

        const formattedUserData = {
            ...userData,
            topics: topicsRefs,
        };

        const userRef = await db.collection('users').add(formattedUserData);

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
 * @returns {Promise<Object>} The updated user data.
 * @throws {Error} If the operation fails.
 */
export async function updateUser(userId, updatedData) {
    try {
        const userRef = db.collection('users').doc(userId);

        const filteredData = Object.fromEntries(
            Object.entries(updatedData).filter(([key, value]) => value !== undefined)
        );

        if (filteredData.topics) {
            filteredData.topics = filteredData.topics.map(id =>
                db.collection('topics').doc(id)
            );
        }

        await userRef.update(filteredData);
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

/**
 * Checks if a user with the given username or email already exists in the database.
 * Both fields are optional, and only the provided fields will be checked for existence.
 * 
 * @param {string} [username] - The username to check (optional).
 * @param {string} [email]    - The email to check (optional).
 * @returns {Promise<Object>} Object indicating if the user exists and details about the conflict.
 * @throws {Error} If the operation fails.
 */
export const checkUserExists = async (username, email) => {
    try {
        if (username) {
            const usernameQuery = await db.collection('users')
                .where('username', '==', username)
                .get();

            if (!usernameQuery.empty) {
                return { 
                    exists: true, 
                    field: 'username', 
                    message: 'Username already exists',
                };
            }
        }

        if (email) {
            const emailQuery = await db.collection('users')
                .where('email', '==', email)
                .get();

            if (!emailQuery.empty) {
                return { 
                    exists: true, 
                    field: 'email', 
                    message: 'Email already exists',
                };
            }
        }

        return { exists: false }; 
    } catch (error) {
        throw new Error('Failed to verify user existence');
    }
};
