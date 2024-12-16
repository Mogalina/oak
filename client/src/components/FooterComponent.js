// Imports and configuration
import React from 'react';
import { Link } from 'react-router-dom';

// Components
import Icons from './Icons';

// Styles
import '../styles/components/footer-component.scss';

// Images
import CoffeeLogo from '../assets/images/pngs/coffee-logo.png';

/**
 * FooterComponent that renders a dynamic footer for the application.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
const FooterComponent = () => {
	// Footer links
	const footerLinks = [
		{ 
			name: 'terms', 
			label: 'Terms of Service', 
			link: '/terms', 
		},
		{ 
			name: 'privacy', 
			label: 'Privacy Policy', 
			link: '/privacy', 
		},
		{ 
			name: 'contact', 
			label: 'Contact Us', 
			link: '/contact', 
		},
	];

	return (
		<footer className="footer">
			{/* Buy Me a Coffee Link */}
			<Link to="https://buymeacoffee.com/ericmoghioros" className="logo-link">
				<button class="coffee-btn">
					Buy Me a Coffee
					<div class="icon">
						<img 
							src={CoffeeLogo}
							alt="Coffee logo" 
							className="coffee-image" 
						/>
					</div>
				</button>
			</Link>

			{/* Footer Links */}
			<div className="footer-links">
				<ul className="footer-links-list">
					{footerLinks.map((item) => (
						<li key={item.name} className="footer-link-item">
							<a href={item.link} className="footer-link">
								<Icons 
									name={item.name} 
									variant="outline" 
									size="20" 
								/>
								<span>{item.label}</span>
							</a>
						</li>
					))}
				</ul>
			</div>

			{/* Footer Copyright */}
			<div className="footer-copyright">
				<p>&copy; {new Date().getFullYear()} Oak. All rights reserved.</p>
			</div>
		</footer>
	);
};

// Export the FooterComponent for usage across the application
export default FooterComponent;
