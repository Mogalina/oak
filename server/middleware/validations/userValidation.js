/**
 * userValidation.js
 * 
 * This file contains validation logic for user-related operations using Joi.
 * 
 * The `validateUser` function ensures that the provided user data adheres to the required 
 * structure and constraints before being processed or saved to the database.
 * 
 * Validations:
 * - username: Must be a string between 3 and 30 characters, consisting only of alphanumeric 
 *               characters and underscores.
 * - email:    Must follow a valid email format.
 * - password: Must be at least 6 characters long.
 * 
 * Dependencies:
 * - Joi: A JavaScript library for schema description and data validation.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/12
 */

import Joi from 'joi';

/**
 * Validates the username field.
 * 
 * @param {string} username - The username to validate.
 * @returns {Object} Returns the validation result.
 */
export const validateUsername = (username) => {
    const schema = Joi.string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z0-9_]+$/)
        .required()
        .messages({
            "string.base":         "Username must be a string",
            "string.empty":        "Username is required",
            "string.min":          "Username must be at least 3 characters",
            "string.max":          "Username cannot exceed 30 characters",
            "string.pattern.base": "Username can only contain characters from [a-zA-Z0-9_]",
        });

    return schema.validate(username);
};

/**
 * Validates the email field.
 * 
 * @param {string} email - The email to validate.
 * @returns {Object} Returns the validation result.
 */
export const validateEmail = (email) => {
    const schema = Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Invalid email format",
            "string.empty": "Email is required",
        });

    return schema.validate(email);
};

/**
 * Validates the password field.
 * 
 * @param {string} password - The password to validate.
 * @returns {Object} Returns the validation result.
 */
export const validatePassword = (password) => {
    const schema = Joi.string()
        .min(6)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min":   "Password must be at least 6 characters long",
        });

    return schema.validate(password);
};
