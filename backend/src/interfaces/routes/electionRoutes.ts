import { Router } from 'express';
import { ElectionController } from '../controllers/ElectionController';
import { AskElectionQuestionUseCase } from '../../application/usecases/AskElectionQuestionUseCase';
import { VertexAIService } from '../../infrastructure/ai/VertexAIService';
import rateLimit from 'express-rate-limit';

const router = Router();

// DI Setup
const aiService = new VertexAIService();
const askElectionQuestionUseCase = new AskElectionQuestionUseCase(aiService);
const electionController = new ElectionController(askElectionQuestionUseCase);

// Rate limiting middleware specifically for the AI endpoint
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests created from this IP, please try again after 15 minutes'
});

router.post('/ask', apiLimiter, electionController.askQuestion);

export default router;
