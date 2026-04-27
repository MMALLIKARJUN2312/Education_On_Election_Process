import { Request, Response } from 'express';
import { AskElectionQuestionUseCase } from '../../application/usecases/AskElectionQuestionUseCase';

export class ElectionController {
    private askElectionQuestionUseCase: AskElectionQuestionUseCase;

    constructor(askElectionQuestionUseCase: AskElectionQuestionUseCase) {
        this.askElectionQuestionUseCase = askElectionQuestionUseCase;
        // Bind the method to ensure 'this' is maintained
        this.askQuestion = this.askQuestion.bind(this);
    }

    public async askQuestion(req: Request, res: Response): Promise<void> {
        try {
            const { question } = req.body;
            
            // Basic Input validation and sanitization
            if (!question || typeof question !== 'string') {
                res.status(400).json({ error: "Invalid question format" });
                return;
            }
            if (question.length > 500) {
                res.status(400).json({ error: "Question is too long" });
                return;
            }

            const answer = await this.askElectionQuestionUseCase.execute(question);
            res.status(200).json(answer);
        } catch (error: any) {
            console.error("Controller Error:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
