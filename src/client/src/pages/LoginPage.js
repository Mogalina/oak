// Imports and configuration
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material'; 

// Routes
import routes from '../routeEndpoints.js';

// Components
import FormComponent from "../components/FormComponent.js";

// Layouts
import MainLayout from "../layouts/MainLayout.js";

// Styles
import '../styles/pages/login-page.scss';

const LoginPage = () => {
    // Scroll to top of the window when first open page
    useEffect(() => {
        window.scrollTo(0, 0); 
    }, []);

    // Set document title
    document.title = 'Oak | Hello Friend';

    // Initialize navigation hook
    const navigate = useNavigate();

    // Define state for validation errors
    const [errors, setErrors] = useState({});
    
    // Define state for button loading state (disabled)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Define state for Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

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
        // Prevent double-click by disabling the button
        setIsSubmitting(true);

        // Validate form data using Joi
        const { error } = validationSchema.validate(formData, { abortEarly: false });
    
        // If validation fails, set error state and re-enable the button
        if (error) {
            const newErrors = {};
            error.details.forEach(err => {
                newErrors[err.path[0]] = err.message;
            });
            setErrors(newErrors);
            setIsSubmitting(false); 
            return;
        }
    
        // Clear previous errors if validation is successful
        setErrors({});
    
        // Show loading Snackbar
        setSnackbarMessage('Checking');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);

        try {
            // Send login request to the backend
            const response = await axios.post(
                process.env.REACT_APP_API_URL + process.env.REACT_APP_API_LOGIN, 
                formData,
            );
    
            // Handle successful response
            if (response.status === 200) {
                // Save token to local storage
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                }
    
                // Extract user data from the response
                const {user, userData} = response.data;
    
                // Save user data in local storage
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userData', JSON.stringify(userData));

                // Update Snackbar to success
                setSnackbarMessage('Login successful');
                setSnackbarSeverity('success');
                
                // Redirect to profile page
                setTimeout(() => {
                    navigate(routes.find(route => route.key === 'profile')?.path);
                }, 2000);
            }
        } catch (err) {
            // Update Snackbar to show error
            setSnackbarMessage(err.response?.data?.message || 'An error occurred');
            setSnackbarSeverity('error');
        } finally {
            // Re-enable the button after the request is complete
            setTimeout(() => {
                setIsSubmitting(false);
            }, 3300);
        }
    };

    // Close Snackbar
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
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
                    submitButtonDisabled={isSubmitting} 
                />

                {/* Snackbar Alert */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                        variant='filled'
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </MainLayout>
    );
};

// Export the LoginPage for usage across the application
export default LoginPage;
