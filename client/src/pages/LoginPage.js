import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Styles
import '../styles/pages/login-page.scss';

// Components
import Icons from '../components/Icons';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Your form submission logic here
    };

    return (
        <MainLayout>
            <ToastContainer 
                position="top-center" 
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
                transition={Bounce}
            />

            <div className="login-page">
                <div className="login-card">
                    <Fade direction="down" cascade damping={0.1} duration={1000}>
                        <h2 className="login-title">Hello Friend</h2>
                    </Fade>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-inputs">
                            <Fade 
                                direction="down" 
                                cascade 
                                damping={0.1} 
                                duration={1000} 
                                delay={200}
                            >
                                <div className="input-wrapper">
                                    <Icons 
                                        name="email" 
                                        size="18"
                                        className="input-icon"
                                    />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        required
                                        autocomplete="off"
                                    />
                                </div>
                            </Fade>
                            <Fade 
                                direction="down" 
                                cascade 
                                damping={0.1} 
                                duration={1000} 
                                delay={300}
                            >
                                <div className="input-wrapper">
                                    <Icons 
                                        name="password" 
                                        size="18"
                                        className="input-icon"
                                    />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Password"
                                        required
                                    />
                                    <div className="visibility-icon" onClick={setPasswordVisible}>
                                        {isPasswordVisible ? (
                                            <Icons 
                                                name="eye" 
                                                size="18"
                                            />
                                        ) : (
                                            <Icons 
                                                name="eyeSlash" 
                                                size="18" 
                                            />
                                        )}
                                    </div>
                                </div>
                            </Fade>
                        </div>
                        <Fade direction="down" cascade damping={0.1} duration={1000} delay={400}>
                            <div>
                                <button type="submit" className="coffee-btn">
                                    Confirm
                                    <div className="icon">
                                        <Icons 
                                            name="chevronRight" 
                                            size="24"
                                        />
                                    </div>
                                </button>
                            </div>
                        </Fade>
                    </form>
                    <Fade direction="down" cascade damping={0.1} duration={1000} delay={500}>
                        <p className="login-footer">
                            Don't have an account? <a href="/signup">Join us</a>
                        </p>
                    </Fade>
                </div>
            </div>
        </MainLayout>
    );
};

export default LoginPage;
