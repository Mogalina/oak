// Imports and configuration
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage.js';

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
			</Routes>
		</Router>
	);
}

// Export the App for usage across application
export default App;
