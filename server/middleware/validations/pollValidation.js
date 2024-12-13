/**
 * pollValidation.js
 * 
 * This file contains validation logic for question-related operations using Joi.
 * 
 * Validations:
 * - question:    Must be a string between 3 and 300 characters.
 * - description: Must be a string between 3 and 1000 characters.
 * - valuesCount: Ensures the count of values is an integer between 1 and 50.
 * - topicsCount: Ensures the count of topics is an integer between 0 and 50.
 * 
 * Dependencies:
 * - Joi: A JavaScript library for schema description and data validation.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/12
 */

import Joi from 'joi';

/**
 * Validates the count of values.
 * 
 * @param {number} count - The count of values to validate.
 * @returns {Object} Returns the validation result.
 */
export const validateValuesCount = (count) => {
    const schema = Joi.number()
        .integer()
        .min(1)
        .max(50)
        .required()
        .messages({
            "number.base":    "Count must be a number",
            "number.integer": "Count must be an integer",
            "number.min":     "Count must be at least 1",
            "number.max":     "Count cannot exceed 50",
            "any.required":   "Count is required",
        });

    return schema.validate(count);
};

/**
 * Validates the count of topics.
 * 
 * @param {number} count - The count of topics to validate.
 * @returns {Object} Returns the validation result.
 */
export const validateTopicsCount = (count) => {
    const schema = Joi.number()
        .integer()
        .min(0)
        .max(50)
        .required()
        .messages({
            "number.base":    "Count must be a number",
            "number.integer": "Count must be an integer",
            "number.min":     "Count must be at least 0",
            "number.max":     "Count cannot exceed 50",
            "any.required":   "Count is required",
        });

    return schema.validate(count);
};

/**
 * Validates the question field.
 * 
 * @param {string} question - The question to validate.
 * @returns {Object} Returns the validation result.
 */
export const validateQuestion = (question) => {
    const schema = Joi.string()
        .min(3)
        .max(300)
        .required()
        .messages({
            "string.base":  "Question must be a string",
            "string.empty": "Question is required",
            "string.min":   "Question must be at least 3 characters",
            "string.max":   "Question cannot exceed 300 characters",
        });

    return schema.validate(question);
};

/**
 * Validates the description field.
 * 
 * @param {string} description - The description to validate.
 * @returns {Object} Returns the validation result.
 */
export const validateDescription = (description) => {
    const schema = Joi.string()
        .min(3)
        .max(1000)
        .messages({
            "string.base": "Description must be a string",
            "string.min":  "Description must be at least 3 characters",
            "string.max":  "Description cannot exceed 1000 characters",
        });
    
    return schema.validate(description);
};
