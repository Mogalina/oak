// Imports and configuration
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Routes
import routes from './routeEndpoints.js';

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
				{routes.map((route, index) => (
                    <Route 
						key={index} 
						path={route.path} 
						element={route.element} 
					/>
                ))}
			</Routes>
		</Router>
	);
}

// Export the App for usage across application
export default App;
