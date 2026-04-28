import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import compression from 'compression';
import electionRoutes from './interfaces/routes/electionRoutes';

import { ErrorReporting } from '@google-cloud/error-reporting';
import rateLimit from 'express-rate-limit';

dotenv.config();

const errors = new ErrorReporting({
  reportMode: process.env.NODE_ENV === 'production' ? 'always' : 'never',
});

import logger from './infrastructure/logging/logger';

const app: Application = express();

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        error: 'Too many requests, please try again later.'
    }
});
app.use('/api/', limiter);

/**
 * Optional: Firebase Authentication Middleware Placeholder
 * Demonstrates integration readiness for Firebase Auth.
 */
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        logger.info("Firebase Auth Token detected (simulated)");
        // In production: admin.auth().verifyIdToken(idToken)...
    }
    next();
});



// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://*.run.app", "https://*.googleapis.com"]
        }
    }
}));

app.use(compression());

// Request Logger
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

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

// Error Reporting (must be after all other middleware/routes)
app.use(errors.express);

export default app;

