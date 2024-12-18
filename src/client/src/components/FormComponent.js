// Imports and configuration
import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { toast } from 'react-toastify';

// Components
import Icons from './Icons';

// Styles
import '../styles/components/form-component.scss';

/**
 * FormComponent - A reusable form component with animated transitions, dynamic fields, and 
 * customizable behaviors for form handling.
 * 
 * @param {string}   title            - The title displayed at the top of the form.
 * @param {Array}    fields           - An array of field objects containing input properties.
 * @param {Function} onSubmit         - Callback function invoked on form submission with form data.
 * @param {string}   footerText       - Text displayed in the footer.
 * @param {string}   footerLinkText   - Text for the footer link.
 * @param {string}   footerLink       - URL for the footer link.
 * @param {string}   submitButtonText - Text for the submit button.
 * @param {string}   submitButtonIcon - Icon name for the submit button.
 * @param {Object}   errors           - Validation errors to display under the form fields.
 * @returns {JSX.Element} The rendered form component.
 */
const FormComponent = ({
    title = "Welcome", 
    fields = [], 
    onSubmit,
    footerText = "", 
    footerLinkText = "", 
    footerLink = "", 
    submitButtonText = "Submit", 
    submitButtonIcon = "chevronRight",
    errors = {},  
}) => {
    // State to manage form data dynamically based on provided fields
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
    );

    /**
     * Updates the form data state when input values change.
     * 
     * @param {Event} event - The input change event.
     */
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Handles the form submission and invokes the onSubmit callback.
     * 
     * @param {Event} event - The form submission event.
     */
    const handleFormSubmit = (event) => {
        event.preventDefault(); 
        if (onSubmit) {
            onSubmit(formData); 
        } else {
            toast.info('Form submitted', { autoClose: 2000 }); 
        }
    };

    return (
        <>
            {/* Form card */}
            <div className="form-card">
                {/* Form title */}
                <Fade direction="down" cascade damping={0.1} duration={1000}>
                    <h2 className="form-title">{title}</h2>
                </Fade>

                {/* Dynamic form inputs */}
                <form className="form" onSubmit={handleFormSubmit} noValidate>
                    <div className="form-inputs">
                        {fields.map((field, index) => (
                            <Fade
                                key={field.name}
                                direction="down"
                                cascade
                                damping={0.1}
                                duration={1000}
                                delay={150 * (index + 1)}
                            >
                                <div className="input-wrapper">
                                    {/* Optional input icon */}
                                    {field.icon && (
                                        <Icons
                                            name={field.icon}
                                            size="18"
                                            className="input-icon"
                                        />
                                    )}

                                    {/* Input element with dynamic attributes */}
                                    <input
                                        type={field.type}
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleInputChange}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        autoComplete={"off"}
                                    />

                                    {/* Display validation error message under the field */}
                                    {errors[field.name] && (
                                        <div className="error-message">{errors[field.name]}</div>
                                    )}
                                </div>
                            </Fade>
                        ))}
                    </div>

                    {/* Submit button */}
                    <Fade 
                        direction="down" 
                        cascade 
                        damping={0.1} 
                        duration={1000} 
                        delay={150 * (fields.length + 1)}
                    >
                        <div>
                            <button type="submit" className="coffee-btn">
                                {submitButtonText}
                                {submitButtonIcon && (
                                    <div className="icon">
                                        <Icons name={submitButtonIcon} size="24" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </Fade>
                </form>

                {/* Footer text and link */}
                {footerText && footerLinkText && (
                    <Fade
                        direction="down"
                        cascade
                        damping={0.1}
                        duration={1000}
                        delay={150 * (fields.length + 2)}
                    >
                        <p className="form-footer">
                            {footerText} <a href={footerLink}>{footerLinkText}</a>
                        </p>
                    </Fade>
                )}
            </div>
        </>
    );
};

// Export the FormComponent for usage across the application
export default FormComponent;
