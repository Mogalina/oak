/**
 * server.js
 * 
 * This file sets up the Express server, configures middleware, and defines the API routes.
 * 
 * Middleware included in this file:
 * - CORS: 		 Ensures that requests from the frontend can be made to the backend.
 * - bodyParser: Parses incoming JSON requests so the data is available in `req.body`.
 * 
 * Routes:
 * - /api: All routes are handled under this prefix.
 * 
 * Dependencies:
 * - express: 	  Web framework to handle HTTP requests and routing.
 * - cors: 	      Middleware to enable Cross-Origin Resource Sharing.
 * - body-parser: Middleware to parse incoming JSON request bodies.
 * - dotenv: 	  Loads environment variables from a `.env` file.
 * - userRoutes:  The route handlers for user-related operations.
 * 
 * Author: Moghioros Eric
 * Date: 2024/12/11
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import pollRoutes from './routes/pollRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Get port from environment variables
const port = process.env.PORT;

// Enable CORS for specific domain
app.use(cors({
	origin: 'http://localhost:3000',
}));

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Use user routes for API requests
app.use('/api', userRoutes);
app.use('/api', pollRoutes);
app.use('/api', topicRoutes);

// Start the server and listen on the specified port
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
