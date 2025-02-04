// Imports and configuration
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";

// Routes
import routes from '../routeEndpoints';

// Components
import Icons from './Icons';

// Styles
import '../styles/components/header-component.scss';

// Images
import OakLogo from '../assets/images/pngs/oak-logo.png';

/**
 * HeaderComponent that renders a dynamic and responsive header.
 *
 * @returns {JSX.Element} The rendered header component.
 */
const HeaderComponent = () => {
	// State for toggling menu
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// State for nav icons direction
	const [navFadeDirection, setNavFadeDirection] = useState("down");

	// Effect for nav icons direction based on screen width
	useEffect(() => {
        const handleResize = () => {
            if (window.matchMedia("(max-width: 550px)").matches) {
                setNavFadeDirection("right");
            } else {
                setNavFadeDirection("down");
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

	// Ref to the header and nav elements to detect outside clicks
	const headerRef = useRef(null);
	const navRef = useRef(null);

	// Menu items to render in the header
	const menuItems = [
		{ 
            name: 'home', 
            link: routes.find(route => route.key === 'home')?.path,
        },
		{ 
            name: 'polls', 
            link: routes.find(route => route.key === 'discover')?.path, 
        },
        { 
            name: 'profile', 
            link: routes.find(route => route.key === 'profile')?.path, 
        },
	];

	// Toggle menu
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Close the menu if a click happens outside of the header
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				headerRef.current && !headerRef.current.contains(event.target) && 
				navRef.current && !navRef.current.contains(event.target)
			) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	return (
		<header ref={headerRef} className="header">
			{/* Logo or brand name */}
			<div className="logo">
				<Link 
					to={routes.find(route => route.key === 'home')?.path} 
					className="logo-link"
				>
					<img 
						src={OakLogo}
						alt="Oak logo" 
						className="logo-image" 
					/>
					<span>ak</span>
				</Link>
			</div>

			{/* Menu Toggle */}
			<div className="menu-icon" onClick={toggleMenu}>
				{isMenuOpen ? (
					<Icons 
						name="xMark" 
						size="24"
					/>
				) : (
					<Icons 
						name="menu" 
						size="24" 
					/>
				)}
			</div>

			{/* Navigation */}
			{isMenuOpen && (
				<nav ref={navRef} className="nav">
					<Fade direction={navFadeDirection} cascade damping={0.1} duration={1000}>
						<ul className="nav-list">
							{menuItems.map((item) => (
								<li key={item.name} className="nav-item">
									<a href={item.link} className="nav-link">
										<Icons 
											name={item.name} 
											size="24" 
											className="icon nav-icon"
										/>
									</a>
								</li>
							))}
						</ul>
					</Fade>
				</nav>
			)}
		</header>
	);
};

// Export the HeaderComponent for usage across the application
export default HeaderComponent;
