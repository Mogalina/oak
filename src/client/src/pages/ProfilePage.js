// Imports and configuration
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fade } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";
import { PieChart, BarChart } from "@mui/x-charts";
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    Button,
    Chip,
    Snackbar,
    Alert
} from "@mui/material";

// Layouts
import MainLayout from "../layouts/MainLayout.js";

// Styles
import '../styles/pages/profile-page.scss';

// Images
import DefaultProfilePicture from '../assets/images/pngs/default-profile-picture.png';

// Components
import Icons from '../components/Icons.js';

// Routes
import routes from '../routeEndpoints';

const ProfilePage = () => {
    // Initialize navigate hook
    const navigate = useNavigate();

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

    // Snackbar states for notifications
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 

    // To close the Snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Dialog-related state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPoll, setSelectedPoll] = useState(null);
    
    const handleDialogOpen = (poll) => {
        setSelectedPoll(poll);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Handler for EditProfile button click
    const handleEditProfileClick = () => {
        const editProfileRoute = routes.find(route => route.key === 'edit-profile');
        if (editProfileRoute) {
            navigate(editProfileRoute.path); 
        }
    };

    // Handler for AddPoll button click
    const handleAddPollClick = () => {
        const addPollRoute = routes.find(route => route.key === 'add-poll');
        if (addPollRoute) {
            navigate(addPollRoute.path); 
        }
    };

    // State for handling the confirmation dialog
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

    // Function to show the confirmation dialog
    const handleConfirmDeleteDialogOpen = (poll) => {
        setSelectedPoll(poll);
        setConfirmDeleteDialogOpen(true);
    };

    // Function to close the confirmation dialog
    const handleConfirmDeleteDialogClose = () => {
        setConfirmDeleteDialogOpen(false);
    };

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
                if (user && userData) {
                    const authToken = localStorage.getItem('authToken');

                    const response = await axios.get(
                        process.env.REACT_APP_API_URL + process.env.REACT_APP_API_POLLS_USER + userData.id,
                        {
                            headers: { Authorization: `Bearer ${authToken}` },
                        }
                    );
                    console.log(response.data);
                    setPolls(response.data.polls || []);
                }
            } catch (error) {
                console.error("Error fetching polls");
            } finally {
                setLoadingPolls(false);
            }
        };

        fetchPolls();
    }, [user, userData]);

    /**
     * Effect to fetch the user's votes from the backend API.
     */
    useEffect(() => {
        const fetchVotes = async () => {
            try {
                if (user) {
                    const authToken = localStorage.getItem('authToken');

                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/votes`,
                        {
                            params: { userId: user.id },
                            headers: { Authorization: `Bearer ${authToken}` },
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

    // Delete Poll handler
    const handleDeletePoll = async () => {
        if (!selectedPoll) {
            setSnackbarMessage("Select poll to remove");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');

            const response = await axios.delete(
                process.env.REACT_APP_API_URL + process.env.REACT_APP_API_POLLS + selectedPoll.id,
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );

            setPolls((prevPolls) => prevPolls.filter(poll => poll.id !== selectedPoll.id));
            setSnackbarMessage("Poll removed");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setSelectedPoll(null); 
        } catch (error) {
            console.error("Error removing poll", error);
            setSnackbarMessage("Error removing poll.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }

        setConfirmDeleteDialogOpen(false);
    };

    return (
        <MainLayout>
            <div className="profile-page">
                {/* Profile card section */}
                <section className="profile-card">
                    <Fade direction="up" cascade damping={0.1} duration={1000} delay={0}>
                        <div className="profile-image-container">
                            <div className="flower-image">
                                <img src={DefaultProfilePicture} alt="Profile" />
                            </div>
                            <Icons 
                                name="updateDoc" 
                                size="35" 
                                className="edit-image-icon"
                            />
                        </div>
                    </Fade>
                    <Fade direction="up" cascade damping={0.1} duration={1000} delay={100}>
                        <h1 className="username">{userData.username}</h1>
                    </Fade>
                    <Fade direction="up" cascade damping={0.1} duration={1000} delay={200}>
                        <div className="activity-info">
                            {/* Display counts of polls and votes */}
                            <p className="polls">{polls?.length || 0} polls</p>
                            <p className="votes">{votes?.length || 0} votes</p>
                        </div>
                    </Fade>
                    <Fade direction="up" cascade damping={0.1} duration={1000} delay={250}>
                        <button className="edit-profile-button" onClick={handleEditProfileClick}>
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
                                <div onClick={handleAddPollClick}>
                                    <Icons 
                                        name="add" 
                                        size="24" 
                                        tooltip="Add Poll"
                                    />
                                </div>
                            </Fade>
                            <Fade direction="up" cascade damping={0.1} duration={1000} delay={400}>
                                <Icons 
                                    name="xMark" 
                                    size="24" 
                                    tooltip="Remove Poll" 
                                    onClick={() => handleConfirmDeleteDialogOpen(selectedPoll)}
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
                                    <button 
                                        className="poll-btn" 
                                        onClick={() => handleDialogOpen(poll)}
                                    >
                                        <Fade 
                                            key={poll.id} 
                                            direction="up" 
                                            duration={500} 
                                            delay={index * 100 + 100}
                                        >
                                            <div className="poll-question">
                                                <Icons
                                                    name={poll.private ? "lockClosed" : "lockOpen"}
                                                    size="18"
                                                    tooltip={poll.private ? "Private Poll" : "Public Poll"}
                                                />
                                                <span>{poll.question}</span>
                                            </div>
                                        </Fade>
                                        <div className="poll-info">
                                            <div className="icon">
                                                <Icons name="arrowRight" size="24" />
                                            </div>
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

                {/* Dialog with Poll Details */}
                <Dialog 
                    open={dialogOpen} 
                    onClose={handleDialogClose} 
                    className="poll-dialog"
                    fullScreen
                >
                    <DialogContent>
                        {selectedPoll ? (
                            <div>
                                <p className="dialog-title">{selectedPoll.question}</p>
                                <p>{selectedPoll.description || ''}</p>
                                
                                {selectedPoll.topics && selectedPoll.topics.length > 0 ? (
                                    <div className="dialog-poll-topics">
                                        {selectedPoll.topics.map((topic, index) => (
                                            <Chip 
                                                key={index} 
                                                label={topic._path.segments[1]}
                                                className="dialog-topic-chip" 
                                                variant='outlined'
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p>No topics available.</p>
                                )}

                                {selectedPoll.values ? (
                                    <div className="dialog-poll-values">
                                        {Object.keys(selectedPoll.values)
                                            .sort((a, b) => selectedPoll.values[b] - selectedPoll.values[a])
                                            .map((option, index) => {
                                                const voteCount = selectedPoll.values[option];
                                                const totalVotes = Object.values(selectedPoll.values).reduce((a, b) => a + b, 0);
                                                const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(2) : 0;
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className="dialog-poll-value"
                                                        style={{
                                                            background: `
                                                                linear-gradient(
                                                                to right, #d76767 ${percentage}%, 
                                                                transparent ${percentage}%)
                                                            `,
                                                        }}
                                                    >
                                                        <span>{option}</span>
                                                        <span>{voteCount} votes</span>
                                                    </div>
                                                );
                                        })}
                                    </div>
                                ) : (
                                    <p>No options available</p>
                                )}

                                {/* Pie Chart Section */}
                                <div className="dialog-chart">
                                    <BarChart
                                        width={undefined}
                                        height={300}
                                        series={[
                                        {
                                            data: Object.keys(selectedPoll.values || {}).map((option) => {
                                                const voteCount = selectedPoll.values[option];
                                                const totalVotes = Object.values(selectedPoll.values).reduce((a, b) => a + b, 0);
                                                const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(2) : 0;
                                                return parseFloat(percentage);
                                            }),
                                            label: 'Percentage',
                                            valueFormatter: (value) => `${value}%`,
                                            color: "#d76767",
                                        },
                                        ]}
                                        xAxis={[{
                                            data: Object.keys(selectedPoll.values || {}),
                                            scaleType: 'band',
                                            tickLabelStyle: {
                                                angle: 45,
                                                textAnchor: 'start',
                                                fill: '#ece9e9',
                                            },
                                            axisLineStyle: {
                                                stroke: 'white', 
                                                strokeWidth: 2, 
                                            }
                                        }]}
                                        yAxis={[{
                                            tickLabelStyle: {
                                                fill: 'transparent',
                                            },
                                            disableLine: "true",
                                            disableTicks: "true",
                                        }]}
                                        slotProps={{
                                            legend: {
                                                hidden: true
                                            }
                                        }}
                                    />
                                </div>

                                <p className="dialog-poll-description">
                                    <Chip 
                                        label={`${Object.values(selectedPoll.values).reduce((a, b) => a + b, 0)} votes`}
                                        className="chip" 
                                        variant='outlined'
                                    />
                                     <Chip 
                                        label={selectedPoll.private ? "Private" : "Public"}
                                        className="chip" 
                                        variant='outlined'
                                    />
                                </p>
                            </div>
                        ) : (
                            <p>Loading poll details...</p>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={handleDialogClose} 
                            color="primary"
                            className="btn-close"
                        >
                            Share
                        </Button>
                        <Button 
                            onClick={handleDialogClose} 
                            color="primary"
                            className="btn-close"
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Confirmation Dialog for Deleting Poll */}
                <Dialog 
                    open={confirmDeleteDialogOpen} 
                    onClose={handleConfirmDeleteDialogClose} 
                    className="confirm-delete-dialog"
                >
                    <DialogContent>
                        <p className="dialog-question">Are you sure you want to remove this Poll ?</p>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={handleConfirmDeleteDialogClose} 
                            className="delete-dialog-btn"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleDeletePoll} 
                            className="delete-dialog-btn"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for notification feedback */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                        variant='filled'
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </MainLayout>
    );
};

// Export the ProfilePage for usage across the application
export default ProfilePage;
