// Imports and configuration
import React from 'react';
import PropTypes from 'prop-types';
import { Fade } from "react-awesome-reveal";

// Styles
import '../styles/components/section-component.scss';

// Components
import Icons from '../components/Icons.js';

/**
 * Section component to display a title, description, and a button.
 *
 * @param {Object} props                 - The component props.
 * @param {string} props.title           - The section title.
 * @param {string} props.description     - The section description.
 * @param {string} props.buttonText      - The button text.
 * @param {function} props.onButtonClick - The button click handler.
 * @param {string} [props.className]     - Custom className for the section.
 *
 * @returns {JSX.Element} A responsive section with a title, description, and a button.
 */
const SectionComponent = ({ 
    title, 
    description, 
    buttonText, 
    onButtonClick, 
    className = '' 
}) => {
    return (
        <section className={`section ${className}`}>
            <div className="section-text">
                <Fade direction="up" cascade damping={0.1} duration={1000}>
                    <h2 className="section-title">{title}</h2>
                </Fade>
                <Fade direction="up" cascade damping={0.1} duration={1000} delay={100}>
                    <p className="section-description">{description}</p>
                </Fade>
            </div>
            <Fade direction="up" cascade damping={0.1} duration={1000} delay={200}>
                <div>
                    <button class="section-button" onClick={onButtonClick}>
                        {buttonText}
                        <div class="icon">
                            <Icons 
                                name="arrowRight" 
                                size="24"
                            />
                        </div>
                    </button>
                </div>
            </Fade>
        </section>
    );
};

// PropTypes validation
SectionComponent.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    onButtonClick: PropTypes.func.isRequired,
    className: PropTypes.string,
};

// Export the SectionComponent for usage across the application
export default SectionComponent;
