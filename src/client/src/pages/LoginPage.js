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
import '../styles/pages/login-page.scss';

const LoginPage = () => {
    // Set document title
    document.title = 'Oak | Hello Friend';

    // Initialize navigation hook
    const navigate = useNavigate();

    // Define state for validation errors
    const [errors, setErrors] = useState({});

    // Joi validation schema
    const validationSchema = Joi.object({
        email: Joi.string()
            .required()
            .messages({
                'any.required': 'Email is required',
                'string.empty': 'Email is required'
            })
            .email({ tlds: { allow: false } })
            .messages({
                'string.email': 'Email is not valid'
            }),
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required',
                'string.empty': 'Password is required'
            })
            .min(6)
            .messages({
                'string.min': 'Minimum 6 characters'
            })
    });

    // Define input fields
    const loginFields = [
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
    ];

    // Form submission handler
    const handleLoginSubmit = async (formData) => {
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
        const loadingToast = toast.loading('Logging', {
            position: "top-center",
        });

        try {
            // Send login request to the backend
            const response = await axios.post(
                process.env.API_URL + process.env.API_LOGIN, 
                formData,
            );

            // Handle successful response
            if (response.status === 200) {
                // Save token to local storage
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                }
                
				setTimeout(() => {
					navigate(routes.find(route => route.key === 'profile')?.path);
				}, 2000);
            }
        } catch (err) {
            // Handle backend errors
            toast.update(loadingToast, {
                render: "Invalid credentials",
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
            <div className="login-page">
				{/* Login form content */}
                <FormComponent
                    title="Hello Friend"
                    fields={loginFields}
                    onSubmit={handleLoginSubmit}
                    footerText="Don't have an account?"
                    footerLinkText="Join Us"
                    footerLink={routes.find(route => route.key === 'signup')?.path}
                    submitButtonText="Let's Go"
                    submitButtonIcon={"chevronRight"}
                    errors={errors}
                />

                {errors.server && <p className="error-text">{errors.server}</p>}

                {/* Toastify container */}
                <ToastContainer />
            </div>
        </MainLayout>
    );
};

// Export the LoginPage for usage across the application
export default LoginPage;
