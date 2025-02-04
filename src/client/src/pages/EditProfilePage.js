// Imports and configuration
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material'; 

// Layouts
import MainLayout from "../layouts/MainLayout.js";

// Components
import FormComponent from "../components/FormComponent.js";

// Styles
import '../styles/pages/edit-profile-page.scss';

// Routes
import routes from '../routeEndpoints.js';

const EditProfilePage = () => {
    // Initialize navigation hook
    const navigate = useNavigate();

    // State to store user information retrieved from localStorage
    const [user, setUser] = useState(null);

    // State to store additional user data (e.g., username) from localStorage
    const [userData, setUserData] = useState(null);

    // Define state for validation errors
    const [errors, setErrors] = useState({});
    
    // Define state for button loading state (disabled)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Define state for Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    /**
     * Effect to load user and userData from localStorage when the component mounts.
     */
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        if (storedUser) {
            setUser(storedUser);
        } else {
            // If user is not logged in, redirect to login page
            const goToLoginRoute = routes.find(route => route.key === 'login');
            if (goToLoginRoute) {
                navigate(goToLoginRoute.path); 
            }
        }
        if (storedUserData) setUserData(storedUserData);
    }, []);

    // Display a loading message if user or userData is not yet loaded
    if (!user || !userData) {
        return <div>Loading...</div>;
    }

    // Set the document title dynamically based on the user's username
    document.title = 'Oak | ' + userData.username;

    // Joi validation schema
    const validationSchema = Joi.object({
        username: Joi.string()
            .allow('')
            .min(3)
            .max(30)
            .regex(/^[a-zA-Z0-9_-]+$/)
            .messages({
                "string.base":         "Username must be a string",
                "string.min":          "Minimum 3 characters",
                "string.max":          "Cannot exceed 30 characters",
                "string.pattern.base": "Only characters from [a-zA-Z0-9_-] are allowed",
            }),
        email: Joi.string()
            .allow('')
            .email({ tlds: { allow: false } })
            .messages({
                'string.email': 'Email is not valid',
            }),
        password: Joi.string()
            .allow('')
            .min(6)
            .messages({
                'string.min': 'Minimum 6 characters',
            }),
        confirmPassword: Joi.string()
            .allow('')
            .valid(Joi.ref('password'))
            .messages({
                'any.only': 'Passwords do not match',
            }),
    });

    // Define input fields
    const editProfileFields = [
        {
            name:        "username",
            type:        "text",
            placeholder: userData.username,
            required:    true,
            icon:        "fingerPrint",
        },
        {
            name:        "email",
            type:        "email",
            placeholder: userData.email,
            required:    true,
            icon:        "email",
        },
        {
            name:        "password",
            type:        "password",
            placeholder: "New Password",
            required:    true,
            icon:        "password",
        },
        {
            name:        "confirmPassword",
            type:        "password",
            placeholder: "Confirm New Password",
            required:    true,
            icon:        "password",
        },
    ];

    // Form submission handler
    const handleEditProfileSubmit = async (formData) => {
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
        
        // Remove confirmPassword from formData
        delete formData.confirmPassword;

        // Check if updates were made
        const filteredFormData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => value.trim() !== "")
        );

        if (Object.keys(filteredFormData).length === 0) {
            setSnackbarMessage("No updates to make");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            setIsSubmitting(false);
            return;
        }
    
        // Show loading Snackbar
        setSnackbarMessage('Checking');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);

        try {
            // Retrieve authentification token from local storage
            const token = localStorage.getItem('authToken');

            // Send edit profile request to the backend
            const response = await axios.put(
                process.env.REACT_APP_API_URL + 
                process.env.REACT_APP_API_UPDATE_PROFILE + 
                userData.id, 
                filteredFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Handle successful response
            if (response.status === 201) {
                // Update Alert to success
                setSnackbarMessage('Profile updated');
                setSnackbarSeverity('success');

                // Update `userData` in localStorage
                const updatedUserData = { 
                    ...userData, 
                    ...filteredFormData 
                };
                setUserData(updatedUserData);
                localStorage.setItem('userData', JSON.stringify(updatedUserData));

                // Check if email was updated
                if ((formData.email && formData.email !== userData.email) || formData.password) {
                    // Notify user
                    setSnackbarMessage('Verification sent on email');
                    setSnackbarSeverity('success');

                    // Clear local storage and log out
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userData');

                    // Redirect to login page
                    setTimeout(() => {
                        navigate(routes.find(route => route.key === 'login')?.path);
                    }, 2000);
                    return;
                }

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
            <div className="edit-profile-page">
                {/* Edit profile form content */}
                <FormComponent
                    title="Edit Profile"
                    fields={editProfileFields}
                    onSubmit={handleEditProfileSubmit}
                    footerLink={routes.find(route => route.key === 'profile')?.path}
                    submitButtonText="Confirm"
                    submitButtonIcon="chevronRight"
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

// Export the EditProfilePage for usage across the application
export default EditProfilePage;
