/**
 * firebase.js
 * 
 * This file handles the initialization of Firebase Admin SDK, Firestore database instance, and Firebase Auth.
 * 
 * It imports the necessary credentials and ensures that both Firebase Admin SDK and Firebase Client SDK 
 * are properly initialized to interact with Firestore and handle authentication.
 * 
 * Dependencies:
 * - firebase-admin:                 Firebase Admin SDK to interact with Firestore.
 * - firebase/app and firebase/auth: Firebase Client SDK for client-side authentication.
 * - dotenv:                         For managing environment variables securely.
 * 
 * The file exports the Firestore and Auth instances for use in other parts of the application.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import admin from 'firebase-admin';
import adminKey from '../firebase-admin-key.json' assert { type: 'json' };
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Ensure Firebase Admin SDK is initialized properly
admin.initializeApp({
    credential: admin.credential.cert(adminKey),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});

// Initialize Firestore
const db = admin.firestore();

// Ensure Client SDK for client-side authentication is initialized properly
const firebaseApp = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});

// Initialize Client Auth
const auth = getAuth(firebaseApp);

// Initialize Admin Auth
const adminAuth = admin.auth();

// Export the Firestore and Auth instance for use in other parts of the application
export { db, auth, adminAuth };
