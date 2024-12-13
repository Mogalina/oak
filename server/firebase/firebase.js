/**
 * firebase.js
 * 
 * This file handles the initialization of Firebase Admin SDK and the Firestore database instance.
 * 
 * It imports the necessary credentials and ensures that the Firebase Admin SDK is properly 
 * initialized to interact with Firestore.
 * 
 * Dependencies:
 * - firebase-admin: Firebase Admin SDK to interact with Firestore.
 * 
 * The file exports the Firestore instance for use in other parts of the application.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import admin from 'firebase-admin';
import adminKey from '../firebase-admin-key.json' assert { type: 'json' };

// Ensure Firebase Admin SDK is initialized properly
admin.initializeApp({
    credential: admin.credential.cert(adminKey),
    databaseURL: 'https://oak-webapp.firebaseio.com',
});

// Initialize Firestore
const db = admin.firestore();

// Export the Firestore instance for use in other parts of the application
export default db;
