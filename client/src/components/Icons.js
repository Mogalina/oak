// Imports and configuration
import React from 'react';

/**
 * Helper function to generate an SVG icon.
 *
 * @param {Object} props                  - Icon properties.
 * @param {string} props.pathData         - The `d` attribute for the <path> element.
 * @param {string} [props.fillRule]       - The fill rule (optional).
 * @param {string} [props.clipRule]       - The clip rule (optional).
 * @param {string} [props.strokeWidth]    - The stroke width (optional).
 * @param {string} [props.strokeLinecap]  - The stroke line cap (optional).
 * @param {string} [props.strokeLinejoin] - The stroke line join (optional).
 * @param {string} [props.fill]           - The fill color (optional).
 * @param {string} [props.size]           - The icon size.
 * @param {string} [props.className]      - The class name for styling (optional).
 * @returns {JSX.Element} The SVG element.
 */
const generateIcon = ({
    pathData, 
    fillRule = '', 
    clipRule = '', 
    strokeWidth = '1.5', 
    strokeLinecap = 'round', 
    strokeLinejoin = 'round',
    fill = 'none', 
    size = '24', 
    className = ''
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={fill} 
        strokeWidth={strokeWidth}
        stroke="currentColor" 
        className={className} 
        style={{ width: size, height: size }}
    >
        {fillRule && <path fillRule={fillRule} />}
        {clipRule && <path clipRule={clipRule} />}
        <path 
            strokeLinecap={strokeLinecap} 
            strokeLinejoin={strokeLinejoin} 
            d={pathData} 
        />
    </svg>
);

/**
 * Icons component that dynamically renders SVG icons.
 * 
 * @param {Object} props             - The props for the icon.
 * @param {string} props.name        - The name of the icon.
 * @param {string} [props.size]      - The size of the icon.
 * @param {string} [props.className] - Custom class name for styling.
 * @returns {JSX.Element} The icon SVG element.
 */
const Icons = ({ 
    name, 
    size = '24', 
    className = '' 
}) => {
    const iconPaths = {
        home: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
        menu: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
        polls: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12",
        profile: "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
        arrowRight: "M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3",
        xMark: "M6 18 18 6M6 6l12 12",
    };

    const pathData = iconPaths[name];
    if (!pathData) {
        return null;
    }
    
    return generateIcon({
        pathData,
        size,
        className,
    });
};

// Export the Icons component for usage across the application
export default Icons;
