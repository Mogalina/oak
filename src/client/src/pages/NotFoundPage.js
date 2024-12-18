// Imports and configuration
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Styles
import '../styles/pages/not-found-page.scss';

// Components
import SectionComponent from '../components/SectionComponent';

// Routes
import routes from '../routeEndpoints';

const NotFoundPage = () => {
    // Initialize navigate hook
    const navigate = useNavigate();

    // Handle Go Back button click
    const handleGoBackBtn = () => {
        const homeRoute = routes.find(route => route.key === 'home');
        if (homeRoute) {
            navigate(homeRoute.path); 
        }
    };

    return (
        <MainLayout 
            showHeader={false}
            showFooter={false}
        >
            <div className="not-found-page">
                {/* 404 Page description section */}
                <SectionComponent 
                    title="404"
                    description="Page not found."
                    buttonText="Go Back"
                    className="not-found-section"
                    onButtonClick={handleGoBackBtn}
                />
            </div>
        </MainLayout>
    );
};

// Export the NotFoundPage for usage across the application
export default NotFoundPage;
