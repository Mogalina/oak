/**
 * passwordUtils.js
 * 
 * This file contains utility functions for handling password-related operations,
 * specifically for hashing and comparing passwords using bcrypt.
 * 
 * Functions include:
 * - hashPassword:    Hashes the password using bcrypt with a configurable number of salt rounds.
 * - comparePassword: Compares the provided password with a stored hashed password.
 * 
 * Dependencies:
 * - bcrypt: A library for hashing passwords and comparing them securely.
 * - dotenv: A library for loading environment variables from a .env file.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/12
 */

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Hashes the password before saving it to the database.
 * 
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export async function hashPassword(password) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS);  
    const hashedPassword = bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

/**
 * Compares the provided password with the hashed password stored in the database.
 * 
 * @param {string} providedPassword - The password entered by the user.
 * @param {string} hashedPassword   - The password stored in the database (hashed).
 * @returns {Promise<boolean>} True if the password matches, false otherwise.
 */
export async function comparePassword(providedPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(providedPassword, hashedPassword);
    return isMatch;
}
