// Imports and configuration
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joi from 'joi';
import { Fade } from "react-awesome-reveal";
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import { Snackbar, 
    Alert, 
    List, 
    ListItem, 
    ListItemText, 
    IconButton, 
    Button, 
    Box 
} from '@mui/material';

// Components
import Icons from '../components/Icons.js';
import MainLayout from "../layouts/MainLayout.js";

// Routes
import routes from '../routeEndpoints.js';

// Styles
import '../styles/pages/add-poll-page.scss';

const AddPollPage = () => {
    // Initialize navigation hook
    const navigate = useNavigate();

    // Set the document title
    document.title = "Oak | Create Poll";

    // State to store user information retrieved from localStorage
    const [user, setUser] = useState(null);

    // State to store additional user data from localStorage
    const [userData, setUserData] = useState(null);

    /**
     * Effect to load user and userData from localStorage when the component mounts.
     */
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        if (storedUser) {
            setUser(storedUser);
        }
        if (storedUserData) {
            setUserData(storedUserData);
        }
    }, []);

    // State to store poll topics and user-defined options
    const [topicList, setTopicList] = useState([]);
    const [listItems, setListItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    
    // Poll privacy flag
    const [isPrivate, setIsPrivate] = useState(false);

    // Selected topics from the autocomplete
    const [value, setValue] = useState([]);

    // Poll question text
    const [question, setQuestion] = useState('');

    // Poll description text
    const [description, setDescription] = useState('');

    // States for error messages
    const [errorMessages, setErrorMessages] = useState({
        question: '',
        description: '',
        pollOptions: '',
        selectedTopics: ''
    });

    // Handle closing of Snackbar notification
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // States to manage Snackbar (notification)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    // Define state for button loading state (disabled)
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    /**
     * Fetches available topics from the API when the page loads.
     */
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_API_URL + process.env.REACT_APP_API_TOPICS,
                );
                setTopicList(response.data);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };
        fetchTopics();
    }, []);

    // Add item to poll options list
    const addItem = () => {
        if (newItem.trim()) {
            setListItems([...listItems, newItem]);
            setNewItem("");
        }
    };

    // Remove item from poll options list
    const removeItem = (index) => {
        const updatedItems = listItems.filter((item, i) => i !== index);
        setListItems(updatedItems);
    };

    // Toggle privacy option (switch for setting the poll as private or public)
    const handlePrivateChange = (event) => {
        setIsPrivate(event.target.checked);
    };

    /**
     * Joi schema defines the validation rules for poll creation form.
     */
    const schema = Joi.object({
        question: Joi.string()
            .min(3)
            .max(300)
            .required()
            .messages({
                'string.base':  'Question must be a string',
                'string.empty': 'Question is required',
                'string.min':   'Question must be at least 3 characters',
                'string.max':   'Question limit is 300 characters',
                'any.required': 'Question is required',
            }),
    
        description: Joi.string()
            .max(1000)
            .allow("")
            .optional()
            .messages({
                'string.base': 'Description must be a string',
                'string.max':  'Description limit is 1000 characters',
        }),
    
        pollOptions: Joi.array().items(
            Joi.string()
                .min(1)
                .max(100)
                .messages({
                    'string.base':  'Option must be a string',
                    'string.empty': 'Options cannot be empty',
                    'string.min':   'Option must be at least 1 character',
                    'string.max':   'Option limit is 100 characters',
                })
            )
            .min(1)
            .max(50)
            .required()
            .messages({
                'array.base':   'Options must be an array',
                'array.min':    'Options are required',
                'array.max':    'You can add maximum 50 options',
                'any.required': 'Options are required',
            }),
    
        selectedTopics: Joi.array()
            .min(1)
            .max(50)
            .required()
            .messages({
                'array.base':   'Topics must be an array',
                'array.min':    'Topics are required',
                'array.max':    'You can add maximum 50 topics',
                'any.required': 'Topics are required',
            }),
    });

    // Handle form submission and validation
    const handleSubmit = async () => {
        // Gather form data
        const formData = {
            question: question, 
            description: description, 
            pollOptions: listItems,
            selectedTopics: value,
        };

        // Validate data using Joi
        const { error } = schema.validate(formData, { abortEarly: false });

        const newErrorMessages = {
            question: '',
            description: '',
            listItems: '',
            value: ''
        };

        // Handle validation errors
        if (error) {
            error.details.forEach((detail) => {
                const field = detail.path[0];
                newErrorMessages[field] = detail.message;
            });
            setErrorMessages(newErrorMessages);
        } else {
            // Show loading Snackbar
            setSnackbarMessage('Checking');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);

            try {
                // Format the poll data to be sent
                const formattedFormData = {
                    question: question,
                    description: description,
                    values: listItems,
                    topics: value,
                    creator: userData.id,
                    private: isPrivate,
                };

                // Retrieve the auth token from localStorage
                const authToken = localStorage.getItem('authToken');

                const response = await axios.post(
                    process.env.REACT_APP_API_URL + process.env.REACT_APP_API_POLLS, 
                    formattedFormData,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
        
                // Handle successful response
                if (response.status === 201) {
                    // Update Snackbar to success
                    setSnackbarMessage('Poll created');
                    setSnackbarSeverity('success');
                    
                    // Redirect to profile page
                    setTimeout(() => {
                        navigate(routes.find(route => route.key === 'profile')?.path);
                    }, 2000);
                }
            } catch (err) {
                const errorMessage = err?.response?.data?.message || 
                    err?.message || "An error occurred";
                setSnackbarMessage(errorMessage);
                setSnackbarSeverity('error');
            } finally {
                // Re-enable the button after the request is complete
                setTimeout(() => {
                    setIsSubmitting(false);
                }, 3300);
            }
        }
    };

    return (
        <MainLayout>
            <div className="add-poll-page">
                <section className="poll-card">
                    {/* Form title */}
                    <h1 className="title">Create Poll</h1>

                    {/* Poll Question Input */}
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Poll Question"
                        multiline
                        maxRows={10}
                        inputProps={{ maxLength: 300 }}
                        fullWidth
                        className="text-field"
                        error={Boolean(errorMessages.question)}
                        helperText={errorMessages.question}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
    
                    {/* Poll Description Input */}
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Poll Description"
                        multiline
                        maxRows={20}
                        inputProps={{ maxLength: 1000 }}
                        fullWidth
                        className="text-field"
                        error={Boolean(errorMessages.description)}
                        helperText={errorMessages.description}
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* Poll Options Section */}
                    <Box className="values-box">
                        <TextField
                            label="Poll Options"
                            value={newItem}
                            multiline
                            maxRows={10}
                            onChange={(e) => setNewItem(e.target.value)}
                            fullWidth
                            inputProps={{ maxLength: 300 }}
                            variant="outlined"
                            autoComplete="off"
                            className="text-field"
                            error={Boolean(errorMessages.pollOptions)}
                            helperText={errorMessages.pollOptions}
                        />
                        <Button
                            onClick={addItem}
                            variant="contained"
                            color="primary"
                            fullWidth
                            className="add-value-btn"
                        >
                            Add Option
                        </Button>
                        <List className="values-list">
                            {listItems.map((item, index) => (
                                <ListItem
                                    className="value-item"
                                    key={index}
                                    secondaryAction={
                                        <IconButton 
                                            edge="end" 
                                            onClick={() => removeItem(index)}
                                        >
                                            <CloseIcon className="value-icon"/>
                                        </IconButton>
                                    }
                                >
                                    <ListItemText 
                                        primary={item} 
                                        className="value-text"
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    {/* Topics Autocomplete */}
                    <Autocomplete
                        multiple
                        id="fixed-tags-demo"
                        value={value}
                        onChange={(event, newValue) => setValue(newValue)}
                        options={topicList.slice(0, 10)} 
                        getOptionLabel={(option) => option.name}
                        renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => {
                                const { key, ...tagProps } = getTagProps({ index });
                                return (
                                    <Chip
                                        key={key}
                                        label={option.name}
                                        {...tagProps}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Topics" 
                                className="text-field"
                                error={Boolean(errorMessages.selectedTopics)}
                                helperText={errorMessages.selectedTopics}
                            />
                        )}
                        className="topics-list"
                    />

                    {/* Make Private Switch */}
                    <FormControlLabel 
                        control={
                            <Switch
                                className="private-switch"
                                checked={isPrivate}
                                onChange={handlePrivateChange}
                            />
                        } 
                        label="Make Private"
                    />

                    {/* Submit Button */}
                    <button 
                        className="submit-btn" 
                        onClick={handleSubmit}
                    >
                        Submit
                        <div className="icon">
                            <Icons name="chevronRight" size="24" />
                        </div>
                    </button>
                </section>

                {/* Snackbar Alert */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
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

// Export the AddPollPage for usage across the application
export default AddPollPage;
