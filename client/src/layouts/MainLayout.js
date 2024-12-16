// Imports and configuration
import React from 'react';

// Components
import HeaderComponent from '../components/HeaderComponent.js';
import FooterComponent from '../components/FooterComponent.js';

// Styles
import '../styles/layouts/main-layout.scss';

/**
 * MainLayout component that wraps the header, footer, and page content.
 *
 * @param {React.ReactNode} children - The page content that will be displayed between the header 
 *                                     and footer.
 * @returns {JSX.Element} The rendered layout with header, content, and footer.
 */
const MainLayout = ({ children }) => {
	return (
		<div className="main-layout">
			{/* Header */}
			<HeaderComponent />

			{/* Main Content */}
			<main className="main-content">
				{children}
			</main>

			{/* Footer */}
			<FooterComponent />
		</div>
	);
};

// Export the MainLayout for usage across the application
export default MainLayout;
