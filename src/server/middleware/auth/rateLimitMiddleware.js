/**
 * rateLimitMiddleware.js
 * 
 * This middleware implements rate limiting functionality using Firebase Firestore.
 * It limits the number of requests a user can make within a specified time window.
 * 
 * Middleware flow:
 * - The user (identified by userId or IP address) is allowed a maximum number of requests per 
 *   minute.
 * - The request count and last request time are stored in Firestore.
 * - If the time window has passed, the count is reset.
 * - If the request limit is exceeded within the window, the request is denied with a 429 status.
 * 
 * Dependencies:
 * - ../../firebase/firebase.js: Firebase initialization file, where Firebase DB instance is 
 *                               imported.
 * - firebase-admin: Firebase Admin SDK to interact with Firestore.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/18
 */

import { db } from '../../firebase/firebase.js';

export const rateLimitMiddleware = async (req, res, next) => {
    // Use either userId or IP address for identifying the client
    const userId = req.userId || req.ip; 
    
    // Define the rate limit parameters
    const windowTime = 60 * 1000;
    const maxRequests = 5;
    
    // Reference to the Firestore document where the rate limit data is stored
    const rateLimitRef = db.collection('rateLimits').doc(userId);
    
    // Retrieve the existing rate limit data from Firestore
    const rateLimitDoc = await rateLimitRef.get();

    // If no document exists for current user, create one
    if (!rateLimitDoc.exists) {
        await rateLimitRef.set({
            count: 1,
            lastRequestTime: Date.now(), 
        });
        return next(); 
    }

    // Retrieve the existing data 
    const data = rateLimitDoc.data();
    const currentTime = Date.now();
    
    // Calculate the time difference between the current request and the last request
    const timeDifference = currentTime - data.lastRequestTime;

    // If the time window has passed, reset the request count
    if (timeDifference > windowTime) {
        await rateLimitRef.update({
            count: 1, 
            lastRequestTime: currentTime, 
        });
        return next();
    }

    // If the user has exceeded the allowed number of requests in the current window
    if (data.count >= maxRequests) {
        return res.status(429).json({
            message: 'Too many requests', 
        });
    }

    // If the user has not exceeded the rate limit, increment the request count
    await rateLimitRef.update({
        count: data.count + 1, 
    });

    // Proceed to the next middleware or route handler
    next();
};
