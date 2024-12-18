// Imports and configuration
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Routes
import routes from '../routeEndpoints.js';

// Components
import FormComponent from "../components/FormComponent.js";

// Layouts
import MainLayout from "../layouts/MainLayout.js";

// Styles
import '../styles/pages/signup-page.scss';

const SignupPage = () => {
    // Set document title
    document.title = 'Oak | Join Us';

    // Initialize navigation hook
    const navigate = useNavigate();

    // Define state for validation errors
    const [errors, setErrors] = useState({});

    // Joi validation schema
    const validationSchema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .regex(/^[a-zA-Z0-9_-]+$/)
            .required()
            .messages({
                "string.base": "Username must be a string",
                "string.empty": "Username is required",
                "string.min": "Minimum 3 characters",
                "string.max": "Cannot exceed 30 characters",
                "string.pattern.base": "Only characters from [a-zA-Z0-9_-] are allowed",
            }),
        email: Joi.string()
            .required()
            .messages({
                'any.required': 'Email is required',
                'string.empty': 'Email is required',
            })
            .email({ tlds: { allow: false } })
            .messages({
                'string.email': 'Email is not valid',
            }),
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required',
                'string.empty': 'Password is required',
            })
            .min(6)
            .messages({
                'string.min': 'Minimum 6 characters',
            }),
        confirmPassword: Joi.string()
            .required()
            .messages({
                'any.required': 'Confirm Password is required',
                'string.empty': 'Confirm Password is required',
            })
            .valid(Joi.ref('password'))
            .messages({
                'any.only': 'Passwords do not match',
            }),
    });

    // Define input fields
    const signupFields = [
        {
            name: "username",
            type: "text",
            placeholder: "Username",
            required: true,
            icon: "fingerPrint",
        },
        {
            name: "email",
            type: "email",
            placeholder: "Email",
            required: true,
            icon: "email",
        },
        {
            name: "password",
            type: "password",
            placeholder: "Password",
            required: true,
            icon: "password",
        },
        {
            name: "confirmPassword",
            type: "password",
            placeholder: "Confirm Password",
            required: true,
            icon: "password",
        },
    ];

    // Form submission handler
    const handleSignupSubmit = async (formData) => {
        // Validate form data using Joi
        const { error } = validationSchema.validate(formData, { abortEarly: false });

        // If validation fails, set error state
        if (error) {
            const newErrors = {};
            error.details.forEach(err => {
                newErrors[err.path[0]] = err.message;
            });
            setErrors(newErrors);
            return;
        }

        // Clear previous errors if validation is successful
        setErrors({});

        // Show loading toast
        const loadingToast = toast.loading('Signup successful', {
            position: "bottom-left",
        });

        try {
            // Send signup request to the backend
            const response = await axios.post(
                process.env.REACT_APP_API_URL + process.env.REACT_APP_API_SIGNUP, 
                formData,
            );

            // Handle successful response
            if (response.status === 201) {
                setTimeout(() => {
                    navigate(routes.find(route => route.key === 'login')?.path);
                }, 2000);
            }
        } catch (err) {
            // Handle backend errors
            toast.update(loadingToast, {
                render: "Signup failed",
                type: "error",
                isLoading: false,
                autoClose: 3000,
				hideProgressBar: true,
				draggable: true,
            });
        }
    };

    return (
        <MainLayout>

            <div className="signup-page">
				{/* Signup form content */}
                <FormComponent
                    title="Join Us"
                    fields={signupFields}
                    onSubmit={handleSignupSubmit}
                    footerText="Already have an account?"
                    footerLinkText="Access"
                    footerLink={routes.find(route => route.key === 'login')?.path}
                    submitButtonText="Join"
                    submitButtonIcon="chevronRight"
                    errors={errors}
                />

                {errors.server && <p className="error-text">{errors.server}</p>}

                {/* Toastify container */}
                <ToastContainer />
            </div>
        </MainLayout>
    );
};

// Export the SignupPage for usage across the application
export default SignupPage;
