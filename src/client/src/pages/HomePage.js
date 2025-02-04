// Imports and configuration
import React, { useEffect, useRef, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Routes
import routes from '../routeEndpoints';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Styles
import '../styles/pages/home-page.scss';

// Components
import SectionComponent from '../components/SectionComponent';
import Icons from '../components/Icons';

const HomePage = () => {
    // Initialize navigation hook
    const navigate = useNavigate();

    // State to store user information retrieved from localStorage
    const [user, setUser] = useState(null);

    // State to store additional user data (e.g., username) from localStorage
    const [userData, setUserData] = useState(null);

    /**
     * Effect to load user and userData from localStorage when the component mounts.
     */
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        if (storedUser) setUser(storedUser);
        if (storedUserData) setUserData(storedUserData);
    }, []);

    // Refs for each section
    const introRef = useRef(null);
    const createPollsRef = useRef(null);
    const shareOpinionRef = useRef(null);
    const discoverRef = useRef(null);

    // State for current section index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Array of section references
    const sectionRefs = [
        introRef, 
        createPollsRef, 
        shareOpinionRef, 
        discoverRef
    ];

    // Flag to prevent multiple scrolls
    const canScroll = useRef(true);

    // Comprehensive scroll handling
    const handleScroll = (event) => {
        // Prevent default scrolling and multiple scroll events
        event.preventDefault();
        
        if (!canScroll.current) return;
        canScroll.current = false;

        // Determine scroll direction
        const isScrollingDown = event.deltaY > 0;

        // Calculate new section index
        let newIndex = currentIndex;
        if (isScrollingDown && currentIndex < sectionRefs.length - 1) {
            newIndex++;
        } else if (!isScrollingDown && currentIndex > 0) {
            newIndex--;
        }

        // Update current index
        setCurrentIndex(newIndex);

        // Smooth scroll to target section
        sectionRefs[newIndex].current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        setTimeout(() => {
            canScroll.current = true;
        }, 1000); 
    };

    // Add scroll event listener
    useEffect(() => {
        const wheelHandler = (event) => {
            event.preventDefault();
            handleScroll(event);
        };

        window.addEventListener('wheel', wheelHandler, { passive: false });
        
        return () => {
            window.removeEventListener('wheel', wheelHandler);
        };
    }, [currentIndex]);

    // Update document title
    useEffect(() => {
        document.title = "Oak | Shape Opinions Together";
    }, []);

    // Handler for CreatePolls button
    const handleCreatePolls = () => {
        const redirectRoute = routes.find(route => route.key === (user ? 'profile' : 'login'));
        if (redirectRoute) {
            navigate(redirectRoute.path); 
        }
    }

    // Handler for OpinionMatters button 
    const handleOpinionMatters = () => {
        const redirectRoute = routes.find(route => route.key === (user ? 'add-poll' : 'login'));
        if (redirectRoute) {
            navigate(redirectRoute.path); 
        }
    }

    // Handler for DIscoverOthers button
    const handleDiscoverOthers = () => {
        const redirectRoute = routes.find(route => route.key === (user ? 'discover' : 'login'));
        if (redirectRoute) {
            navigate(redirectRoute.path); 
        }
    }

    return (
        <MainLayout>
            <div className="home-page">
                {/* Home intro section */}
                <section className="home-intro" ref={introRef}>
                    <div className="home-intro-content">
                        <Fade direction="up" cascade damping={0.1} duration={1000}>
                            <span className="motto">Shape Opinions Together</span>
                            <div className="content-options">
                                <Link to={routes.find(route => 
                                    route.key === (user ? 'profile' : 'login'))?.path}
                                >
                                    <Fade 
                                        direction="up" 
                                        cascade 
                                        damping={0.1} 
                                        duration={1000} 
                                        delay={100}
                                    >
                                        <div>
                                            <button className="coffee-btn">
                                                Get Started
                                                <div className="icon">
                                                    <Icons 
                                                        name="chevronRight" 
                                                        size="24"
                                                    />
                                                </div>
                                            </button>
                                        </div>
                                    </Fade>
                                </Link>
                            </div>
                        </Fade>
                    </div>
                </section>
                
                {/* Home description sections */}
                <section className="home-description">
                    <div ref={createPollsRef}>
                        <SectionComponent 
                            title="Create Polls"
                            description="Create polls for personal usage or share with the community."
                            className="home-create-polls"
                            buttonText="Create"
                            onButtonClick={handleCreatePolls}
                        />
                    </div>
                    <div ref={shareOpinionRef}>
                        <SectionComponent 
                            title="Opinion Matters"
                            description="Interact with others to share your ideas on different topics."
                            buttonText="Share"
                            className="home-share-opinion"
                            onButtonClick={handleOpinionMatters}
                        />
                    </div>
                    <div ref={discoverRef}>
                        <SectionComponent 
                            title="Discover Others"
                            description="Discover different polls and let them know your opinion."
                            buttonText="Discover"
                            className="home-discover"
                            onButtonClick={handleDiscoverOthers}
                        />
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

// Export the HomePage for usage across the application
export default HomePage;
