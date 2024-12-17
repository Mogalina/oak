// Imports and configuration
import React, { useEffect, useRef, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Styles
import '../styles/pages/home-page.scss';

// Components
import SectionComponent from '../components/SectionComponent';

const HomePage = () => {
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

    return (
        <MainLayout>
            <div className="home-page">
                {/* Home intro section */}
                <section className="home-intro" ref={introRef}>
                    <div className="home-intro-content">
                        <Fade direction="up" cascade damping={0.1} duration={1000}>
                            <span className="motto">Shape Opinions Together</span>
                            <div className="content-options">
                                <Link to="/login">
                                    <Fade 
                                        direction="up" 
                                        cascade 
                                        damping={0.1} 
                                        duration={1000} 
                                        delay={100}
                                    >
                                        <div>
                                            <button className="btn-option">Get Started</button>
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
                            description="Create polls for personal usage or share with others."
                            className="home-create-polls"
                            buttonText="Create"
                        />
                    </div>
                    <div ref={shareOpinionRef}>
                        <SectionComponent 
                            title="Opinion Matters"
                            description="Discover or create polls and interact with others to share your ideas."
                            buttonText="Share"
                            className="home-share-opinion"
                        />
                    </div>
                    <div ref={discoverRef}>
                        <SectionComponent 
                            title="Discover Others"
                            description="Discover polls and interact with others to share your ideas."
                            buttonText="Discover"
                            className="home-discover"
                        />
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

// Export the HomePage for usage across the application
export default HomePage;
