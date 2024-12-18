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
 * - dotenv:                     A library to load environment variables from a `.env` file.
 * - ../../models/user.js        Model for user defined operations.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import { auth } from '../../firebase/firebase.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendEmailVerification,
    signOut
} from 'firebase/auth';
import dotenv from 'dotenv';
import { checkUserExists } from '../../models/user.js';
import { createUserController } from '../../controllers/userController.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Registers a new user with email and password.
 * @param {string} username - User's username.
 * @param {string} email    - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} Firebase user credentials.
 */
export async function registerUser(username, email, password) {
    try {
        const checkUser = await checkUserExists(username, email);
        if (checkUser.exists) {
            throw new Error(checkUser.message);
        }

        const userData = {
            username: username,
            email: email,
            password: password,
            topics: [],
        };

        await createUserController({
            body: userData,
        }, {
            status: () => ({
                json: (data) => data,
            }),
        });

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user, {
            url: process.env.EMAIL_VERIFICATION_REDIRECT_URL,
        });

        return userCredential.user;
    } catch (error) {
        if (error.code === 'auth/too-many-requests') {
            throw new Error('Too many requests');
        }
        throw new Error(error.message);
    }
}

/**
 * Logs in a user with email and password and sets a cookie.
 * 
 * @param {string} email    - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} Firebase user credentials.
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            throw new Error('Email not verified');
        }

        const token = await userCredential.user.getIdToken();
        return {
            user: userCredential.user,
            token, 
        };
    } catch (error) {
        if (error.code === 'auth/too-many-requests') {
            throw new Error('Too many requests');
        }
        if (error.code === 'auth/invalid-credential') {
            throw new Error('Invalid credentials');
        }
        throw new Error(error.message);
    }
}

/**
 * Logs out the current user and clears the cookie.
 * 
 * @returns {Promise<void>}
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;';
        return 'Logged out successfully.';
    } catch (error) {
        throw new Error(error.message);
    }
}
