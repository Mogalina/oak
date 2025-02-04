// Imports and configuration
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material'; 
import { Fade } from 'react-awesome-reveal';

// Routes
import routes from '../routeEndpoints.js';

// Layouts
import MainLayout from "../layouts/MainLayout.js";

// Components
import Icons from '../components/Icons.js';

// Styles
import '../styles/pages/discover-page.scss';

const DiscoverPage = () => {
    // Scroll to top of the window when first open page
    useEffect(() => {
        window.scrollTo(0, 0); 
    }, []);

    // Set document title
    document.title = 'Oak | Polls Feed';

    // State to store user information retrieved from localStorage
    const [user, setUser] = useState(null);

    // State to store additional user data (e.g., username) from localStorage
    const [userData, setUserData] = useState(null);

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

    // Close Snackbar
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

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

    // States for error messages
    const [errorMessages, setErrorMessages] = useState({
        pollSearch: ''
    });

    // Search poll text
    const [pollSearch, setPollSearch] = useState('');

    return (
        <MainLayout>
            <div className="discover-page">
                <Fade 
                    direction="up" 
                    cascade 
                    damping={0.1} 
                    duration={1000} 
                    delay={100}
                >
                    <div className="search-polls">
                        <input
                            type="text"
                            placeholder="Search keywords or topics"
                            maxLength={200}
                            fullWidth
                            className="search-polls-field"
                            error={Boolean(errorMessages.pollSearch)}
                            helperText={errorMessages.pollSearch}
                            onChange={(e) => setPollSearch(e.target.value)}
                        />
                        <Icons 
                            name="search" 
                            size="16" 
                            className="search-icon"
                        />
                    </div>
                </Fade>

                {/* Snackbar Alert */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbarSeverity}
                        sx={{ width: "100%" }}
                        variant="filled"
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </MainLayout>
    );
};

// Export the DiscoverPage for usage across the application
export default DiscoverPage;
