/**
 * topicValidation.js
 * 
 * This file contains validation logic for user-related operations using Joi.
 * 
 * Validations:
 * - name: Ensures the name is a string between 3 and 50 characters.
 * 
 * Dependencies:
 * - Joi: A JavaScript library for schema description and data validation.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/13
 */

import Joi from 'joi';

/**
 * Validates the name field.
 * 
 * @param {string} name - The name to validate.
 * @returns {Object} Returns the validation result.
 */
export const validateName = (name) => {
    const schema = Joi.string()
        .min(3)
        .max(50)
        .regex(/^[a-zA-Z0-9-]+$/)
        .required()
        .messages({
            "string.base":         "Name must be a string",
            "string.empty":        "Name is required",
            "string.min":          "Name must be at least 3 characters",
            "string.max":          "Name cannot exceed 50 characters",
            "string.pattern.base": "Name can only contain characters from [a-zA-Z0-9-]",
        });

    return schema.validate(name);
};
