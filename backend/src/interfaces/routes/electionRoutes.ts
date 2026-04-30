import { Router } from 'express';
import { body } from 'express-validator';
import { ElectionController } from '../controllers/ElectionController';
import { AskElectionQuestionUseCase } from '../../application/usecases/AskElectionQuestionUseCase';
import { VertexAIService } from '../../infrastructure/ai/VertexAIService';
import rateLimit from 'express-rate-limit';

import { FirestoreService } from '../../infrastructure/database/FirestoreService';

const router = Router();

// DI Setup
const aiService = new VertexAIService();
const firestoreService = new FirestoreService();
const askElectionQuestionUseCase = new AskElectionQuestionUseCase(aiService, firestoreService);
const electionController = new ElectionController(askElectionQuestionUseCase);


// Timeline Endpoint
router.get('/timeline', async (req, res) => {
    // Efficiency: Cache the timeline in the browser for 1 hour to reduce redundant network calls
    res.setHeader('Cache-Control', 'public, max-age=3600');
    const timeline = await firestoreService.getElectionTimeline();
    res.status(200).json(timeline);
});

// Rate limiting middleware specifically for the AI endpoint
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Stricter limit for AI calls
    message: {
        status: 429,
        error: 'Too many questions. Please wait 15 minutes.'
    }
});

// Validation middleware
const askValidation = [
    body('question')
        .isString().withMessage('Question must be a string')
        .trim()
        .notEmpty().withMessage('Question cannot be empty')
        .isLength({ max: 500 }).withMessage('Question must be less than 500 characters')
        .escape()
];

router.post('/ask', apiLimiter, askValidation, electionController.askQuestion);

export default router;

