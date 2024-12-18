import React, { useState, useEffect } from 'react';

// Layouts
import MainLayout from "../layouts/MainLayout.js";

// Styles
import '../styles/pages/signup-page.scss';

const ProfilePage = () => {
    // Set document title
    document.title = "Oak | Profile";

    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage (or state/context if used)
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser); // Set user data if it exists
        }
    }, []);

    if (!user) {
        return <div>Loading</div>;
    }

    return (
        <MainLayout>
            <div className="signup-page">
                <h1>Welcome, {user.email}!</h1>
            </div>
        </MainLayout>
    );
};

export default ProfilePage;
