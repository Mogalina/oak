// Imports and configuration
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';

// Styles
import 'react-toastify/dist/ReactToastify.css'; 

/**
 * App component that defines the routes of the application.
 * 
 * @returns {JSX.Element} The rendered component with routing setup.
 */
function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
		</Router>
	);
}

// Export the App for usage across application
export default App;
