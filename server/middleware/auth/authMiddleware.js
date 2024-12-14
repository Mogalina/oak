/**
 * authMiddleware.js
 * 
 * This file contains middleware to handle authentication for protected routes.
 * 
 * It verifies the presence of an authentication token stored in cookies, 
 * decodes the token using Firebase's public keys, and attaches the authenticated user 
 * information to the request object for downstream use.
 * 
 * Dependencies:
 * - jsonwebtoken: A library to verify and decode JWTs.
 * - dotenv:       A library to load environment variables from a `.env` file.
 * - axios:        A library to make HTTP requests to get the Firebase public keys.
 * 
 * Middleware provided:
 * - authenticate: Verifies the authentication token from cookies and protects API routes.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables from .env file
dotenv.config();

// URL to get Firebase public keys for RS256 verification
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com';

/**
 * Middleware to authenticate users based on a token stored in cookies.
 * 
 * @param {Object} req    - The HTTP request object.
 * @param {Object} res    - The HTTP response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 * @returns {void}
 */
export async function authenticate(req, res, next) {
    const token = req.cookies.authToken; 
    if (!token) {
        return res.status(401).json({
            message: 'Authentication token is required',
        });
    }

    try {
        const { data: publicKeys } = await axios.get(JWKS_URL);
        const decodedHeader = jwt.decode(token, { complete: true });
        const kid = decodedHeader.header.kid;

        const publicKey = publicKeys[kid];
        if (!publicKey) {
            throw new Error('Invalid key ID');
        }

        const decoded = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            issuer: 'https://securetoken.google.com/' + process.env.FIREBASE_PROJECT_ID,
            audience: process.env.FIREBASE_PROJECT_ID,
        });

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message: 'Invalid or expired token',
            error: error.message,
        });
    }
}
