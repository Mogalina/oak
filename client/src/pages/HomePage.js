// Imports and configuration
import React, { useEffect, useRef, useState } from 'react';
import { Fade } from 'react-awesome-reveal';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Styles
import '../styles/pages/home-page.scss';

// Components
import SectionComponent from '../components/SectionComponent';

/**
 * HomePage component.
 * 
 * @returns {JSX.Element} The rendered home page component wrapped in the MainLayout.
 */
const HomePage = () => {
    // Update the document title when the component is mounted
    useEffect(() => {
        document.title = "Oak | Shape Opinions Together";
    }, []);

    // Refs for each section
    const introRef = useRef(null);
    const createPollsRef = useRef(null);
    const shareOpinionRef = useRef(null);
    const discoverRef = useRef(null);

    // State to track the current section index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Array of section refs
    const sectionRefs = [
        introRef, 
        createPollsRef, 
        shareOpinionRef, 
        discoverRef,
    ];

    // Scroll handler
    const handleScroll = (event) => {
        const scrollDirection = event.deltaY > 0 ? 1 : -1; 
        const newIndex = Math.min(
            Math.max(currentIndex + scrollDirection, 0), 
            sectionRefs.length - 1
        );

        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
            sectionRefs[newIndex].current.scrollIntoView({
                behavior: "auto", 
                block: "start",
            });
        }
    };

    useEffect(() => {
        // Add a wheel event listener for fast scrolling
        window.addEventListener("wheel", handleScroll);

        // Clean up the event listener on component unmount
        return () => window.removeEventListener("wheel", handleScroll);
    }, [currentIndex]); // Re-run effect when currentIndex changes

    return (
        <MainLayout>
            {/* Main content of the HomePage */}
            <div className="home-page">
                {/* Home intro */}
                <section className="home-intro" ref={introRef}>
                    <div className="home-intro-content">
                        <Fade direction="up" cascade damping={0.1} duration={1000}>
                            <span className="motto">Shape Opinions Together</span>
                            <div className="content-options">
                                <button className="btn-option">Get Started</button>
                            </div>
                        </Fade>
                    </div>
                </section>
                
                {/* Home description */}
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
