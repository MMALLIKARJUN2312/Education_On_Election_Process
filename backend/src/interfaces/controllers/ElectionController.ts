import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AskElectionQuestionUseCase } from '../../application/usecases/AskElectionQuestionUseCase';
import logger from '../../infrastructure/logging/logger';

/**
 * Controller responsible for handling election-related user requests.
 * Adheres to Clean Architecture by orchestrating use cases.
 */
export class ElectionController {
    private askElectionQuestionUseCase: AskElectionQuestionUseCase;

    constructor(askElectionQuestionUseCase: AskElectionQuestionUseCase) {
        this.askElectionQuestionUseCase = askElectionQuestionUseCase;
        // Bind the method to ensure 'this' is maintained
        this.askQuestion = this.askQuestion.bind(this);
    }

    /**
     * Handles the 'Ask Question' endpoint.
     * Performs validation, sanitization, and calls the appropriate use case.
     */
    public async askQuestion(req: Request, res: Response): Promise<void> {
        // Check for validation errors from express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const { question } = req.body;
            logger.info(`Received question: ${question.substring(0, 50)}...`);

            const answer = await this.askElectionQuestionUseCase.execute(question);
            res.status(200).json(answer);
        } catch (error: any) {
            logger.error(`Controller Error: ${error.message}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

