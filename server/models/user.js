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
 * Creates a new user in the collection.
 * 
 * @param {Object} userData - The data of the user to be created.
 * @returns {string} The unique ID of the created user.
 */
export async function createUser(userData) {
    try {
        const userRef = await db.collection('users').add(userData);
        console.log('User created successfully');

        return userRef.id;
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

/**
 * Retrieves a user from the collection by their unique ID.
 * 
 * @param {string} userId - The ID of the user to be retrieved.
 * @returns {Object|null} The user data if found, otherwise null if no user is found.
 */
export async function getUserById(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            console.log('User data:', userDoc.data());
            return userDoc.data();
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error reading user:', error);
    }
}

/**
 * Updates an existing user's data in the collection.
 * 
 * @param {string} userId - The ID of the user to be updated.
 * @param {Object} updatedData - The updated user data to be saved.
 * @returns {void}
 */
export async function updateUser(userId, updatedData) {
    try {
        const userRef = db.collection('users').doc(userId);
        await userRef.update(updatedData);
        console.log('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

/**
 * Deletes a user from the collection by their unique ID.
 * 
 * @param {string} userId - The ID of the user to be deleted.
 * @returns {void}
 */
export async function deleteUserById(userId) {
    try {
        await db.collection('users').doc(userId).delete();
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}
