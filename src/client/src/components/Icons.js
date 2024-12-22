// Imports and configuration
import React from 'react';
import Tooltip from '@mui/material/Tooltip';

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
        style={{ width: size, height: size, cursor: "pointer" }}
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
 * @param {string} [props.tooltip]   - Tooltip text to display.
 * @returns {JSX.Element} The icon SVG element.
 */
const Icons = ({ 
    name, 
    size = '24', 
    className = '',
    tooltip = ''
}) => {
    const iconPaths = {
        home: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
        menu: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
        polls: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12",
        profile: "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
        arrowRight: "M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3",
        xMark: "M6 18 18 6M6 6l12 12",
        chevronRight: "m8.25 4.5 7.5 7.5-7.5 7.5",
        email: "M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25",
        password: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z",
        fingerPrint: "M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33",
        add: "M12 4.5v15m7.5-7.5h-15",
    };

    const pathData = iconPaths[name];
    if (!pathData) {
        return null;
    }
    
    const icon = generateIcon({
        pathData,
        size,
        className,
    });

    return tooltip ? <Tooltip title={tooltip} arrow>{icon} </Tooltip> : icon;
};

// Export the Icons component for usage across the application
export default Icons;
