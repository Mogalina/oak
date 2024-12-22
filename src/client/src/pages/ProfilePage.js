// Imports and configuration
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fade } from "react-awesome-reveal";

// Layouts
import MainLayout from "../layouts/MainLayout.js";

// Styles
import '../styles/pages/profile-page.scss';

// Images
import DefaultProfilePicture from '../assets/images/pngs/default-profile-picture.png';

// Components
import Icons from '../components/Icons.js';

const ProfilePage = () => {
    // State to store user information retrieved from localStorage
    const [user, setUser] = useState(null);

    // State to store additional user data (e.g., username) from localStorage
    const [userData, setUserData] = useState(null);

    // State to store the user's polls fetched from the backend
    const [polls, setPolls] = useState([]);

    // State to store the user's votes fetched from the backend
    const [votes, setVotes] = useState([]);

    // State to handle loading status for polls and votes
    const [loadingPolls, setLoadingPolls] = useState(true);
    const [loadingVotes, setLoadingVotes] = useState(true);

    /**
     * Effect to load user and userData from localStorage when the component mounts.
     */
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        if (storedUser) setUser(storedUser);
        if (storedUserData) setUserData(storedUserData);
    }, []);

    /**
     * Effect to fetch the user's polls from the backend API.
     */
    useEffect(() => {
        const fetchPolls = async () => {
            try {
                if (user) {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/polls`,
                        {
                            params: { userId: user.id },
                            headers: { Authorization: `Bearer ${user.token}` },
                        }
                    );
                    setPolls(response.data.polls);
                }
            } catch (error) {
                console.error("Error fetching polls");
            } finally {
                setLoadingPolls(false);
            }
        };

        fetchPolls();
    }, [user]);

    /**
     * Effect to fetch the user's votes from the backend API.
     */
    useEffect(() => {
        const fetchVotes = async () => {
            try {
                if (user) {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/votes`,
                        {
                            params: { userId: user.id },
                            headers: { Authorization: `Bearer ${user.token}` },
                        }
                    );
                    setVotes(response.data.votes); 
                }
            } catch (error) {
                console.error("Error fetching votes");
            } finally {
                setLoadingVotes(false); 
            }
        };

        fetchVotes();
    }, [user]);

    // Display a loading message if user or userData is not yet loaded
    if (!user || !userData) {
        return <div>Loading...</div>;
    }

    // Set the document title dynamically based on the user's username
    document.title = 'Oak | ' + userData.username;

    return (
        <MainLayout>
            <div className="profile-page">
                {/* Profile card section */}
                <section className="profile-card">
                    <Fade direction="up" cascade damping={0.1} duration={1000} delay={0}>
                        <div className="flower-image">
                            <img src={DefaultProfilePicture} alt="Profile" />
                        </div>
                    </Fade>
                    <Fade direction="up" cascade damping={0.1} duration={1000} delay={100}>
                        <h1 className="username">{userData.username}</h1>
                    </Fade>
                    <Fade direction="up" cascade damping={0.1} duration={1000} delay={200}>
                        <div className="activity-info">
                            {/* Display counts of polls and votes */}
                            <p className="polls">{polls.length} polls</p>
                            <p className="votes">{votes.length} votes</p>
                        </div>
                    </Fade>
                    <Fade direction="up" cascade damping={0.1} duration={1000} delay={250}>
                        <button className="edit-profile-button">
                            Edit Profile
                            <div className="icon">
                                <Icons name="arrowRight" size="24" />
                            </div>
                        </button>
                    </Fade>
                </section>

                {/* Polls section */}
                <section className="polls-window">
                    <header className="polls-header">
                        <Fade direction="up" cascade damping={0.1} duration={1000} delay={200}>
                            <span className="title">Polls</span>
                        </Fade>
                        <nav className="polls-options">
                            <Fade direction="up" cascade damping={0.1} duration={1000} delay={300}>
                                <Icons 
                                    name="add" 
                                    size="24" 
                                    tooltip="Add Poll" 
                                />
                            </Fade>
                            <Fade direction="up" cascade damping={0.1} duration={1000} delay={400}>
                                <Icons 
                                    name="xMark" 
                                    size="24" 
                                    tooltip="Remove Poll" 
                                />
                            </Fade>
                        </nav>
                    </header>
                    <main className="polls-container">
                        {loadingPolls ? (
                            <p>Loading polls...</p>
                        ) : polls.length > 0 ? (
                            polls.map((poll, index) => (
                                <Fade 
                                    key={poll.id} 
                                    direction="up" 
                                    duration={500} 
                                    delay={index * 100}
                                >
                                    <button className="poll-btn">
                                        <Fade 
                                            key={poll.id} 
                                            direction="up" 
                                            duration={500} 
                                            delay={index * 100 + 100}
                                        >
                                            <span>{poll.question}</span>
                                        </Fade>
                                        <div className="poll-info">
                                            <Fade 
                                                key={poll.id} 
                                                direction="up" 
                                                duration={500} 
                                                delay={index * 100 + 200}
                                            >
                                                <span 
                                                    className="poll-votes"
                                                >
                                                    {poll.votesCount} votes
                                                </span>
                                            </Fade>
                                            <Fade 
                                                key={poll.id} 
                                                direction="up" 
                                                duration={500} 
                                                delay={index * 100 + 200}
                                            >
                                                <div className="icon">
                                                    <Icons name="arrowRight" size="24" />
                                                </div>
                                            </Fade>
                                        </div>
                                    </button>
                                </Fade>
                            ))
                        ) : (
                            <Fade direction="up" duration={1000} delay={500}>
                                <p 
                                    className="no-polls-info"
                                >
                                    Looks like you haven't created any polls.
                                </p>
                            </Fade>
                        )}
                    </main>
                </section>

                {/* Votes section */}
                <section className="votes-window">
                    <header className="polls-header">
                        <Fade direction="up" cascade damping={0.1} duration={1000} delay={200}>
                            <span className="title">Votes</span>
                        </Fade>
                        <nav className="polls-options">
                            <Fade direction="up" cascade damping={0.1} duration={1000} delay={300}>
                                <Icons name="add" size="24" tooltip="Add Vote" />
                            </Fade>
                            <Fade direction="up" cascade damping={0.1} duration={1000} delay={400}>
                                <Icons name="xMark" size="24" tooltip="Remove Vote" />
                            </Fade>
                        </nav>
                    </header>
                    <main className="polls-container">
                        {loadingVotes ? (
                            <p>Loading votes...</p>
                        ) : votes.length > 0 ? (
                            votes.map((vote, index) => (
                                <Fade 
                                    key={vote.pollId}
                                    direction="up" 
                                    duration={500} 
                                    delay={index * 100}
                                >
                                    <button className="poll-btn">
                                        <Fade 
                                            key={vote.pollId} 
                                            direction="up" 
                                            duration={500} 
                                            delay={index * 100 + 100}
                                        >
                                            <span>{vote.question}</span>
                                        </Fade>
                                        <div className="poll-info">
                                            <Fade 
                                                key={vote.pollId} 
                                                direction="up" 
                                                duration={500} 
                                                delay={index * 100 + 200}
                                            >
                                                <span className="poll-votes">{vote.choice}</span>
                                            </Fade>
                                            <Fade 
                                                key={vote.pollId} 
                                                direction="up" 
                                                duration={500} 
                                                delay={index * 100 + 300}
                                            >
                                                <div className="icon">
                                                    <Icons name="arrowRight" size="24" />
                                                </div>
                                            </Fade>
                                        </div>
                                    </button>
                                </Fade>
                            ))
                        ) : (
                            <Fade direction="up" duration={1000} delay={500}>
                                <p 
                                    className="no-polls-info"
                                >
                                    Looks like you haven't voted on any polls.
                                </p>
                            </Fade>
                        )}
                    </main>
                </section>
            </div>
        </MainLayout>
    );
};

// Export the ProfilePage for usage across the application
export default ProfilePage;
