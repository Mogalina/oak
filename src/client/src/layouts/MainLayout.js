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
 * @param {boolean} showHeader 	     - Determines whether to display the header.
 * @param {boolean} showFooter 	     - Determines whether to display the footer.
 * @returns {JSX.Element} The rendered layout with header, content, and optional footer.
 */
const MainLayout = ({ 
	children, 
	showHeader = true,
	showFooter = true 
}) => {
	return (
		<div className="main-layout">
			{/* Header */}
			{showHeader && <HeaderComponent />}

			{/* Main Content */}
			<main className="main-content">
				{children}
			</main>

			{/* Conditional Footer */}
			{showFooter && <FooterComponent />}
		</div>
	);
};

// Export the MainLayout for usage across the application
export default MainLayout;
