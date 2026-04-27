import dotenv from 'dotenv';
dotenv.config({ override: true });

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import electionRoutes from './interfaces/routes/electionRoutes';

const app: Application = express();

// Security Middleware
app.use(helmet());

// CORS configuration - configure for your frontend origin
app.use(cors({
    origin: '*', // For production, restrict this to your frontend URL
    methods: ['GET', 'POST']
}));

// Body parsing
app.use(express.json());

// Routes
app.use('/api/v1/election', electionRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Election Education API is running.' });
});

export default app;
