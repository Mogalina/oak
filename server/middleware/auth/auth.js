/**
 * auth.js
 * 
 * This file handles user authentication functions using Firebase Authentication.
 * 
 * It provides functions for user registration, login, and logout, leveraging the Firebase 
 * Authentication SDK.
 * 
 * Dependencies:
 * - firebase/auth:              Firebase Client SDK for authentication operations.
 * - ../../firebase/firebase.js: Firebase initialization file, where Firebase Auth instance is 
 *                               imported.
 * 
 * The file exports functions for user authentication to be used in other parts of the application:
 * - registerUser: Registers a new user with email and password.
 * - loginUser:    Logs in a user with email and password.
 * - logoutUser:   Logs out the current user.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { auth } from '../../firebase/firebase.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut
} from 'firebase/auth';

/**
 * Registers a new user with email and password.
 * 
 * @param {string} email    - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} Firebase user credentials.
 */
export async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
    }
}

/**
 * Logs in a user with email and password.
 * 
 * @param {string} email    - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} Firebase user credentials.
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
    }
}

/**
 * Logs out the current user.
 * 
 * @returns {Promise<void>}
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        return 'User logged out successfully.';
    } catch (error) {
        throw new Error(`Logout failed: ${error.message}`);
    }
}
