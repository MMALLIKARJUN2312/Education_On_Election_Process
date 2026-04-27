import { IAIService } from '../../domain/interfaces/IAIService';

export class AskElectionQuestionUseCase {
    private aiService: IAIService;

    constructor(aiService: IAIService) {
        this.aiService = aiService;
    }

    public async execute(question: string): Promise<any> {
        if (!question || question.trim() === '') {
            throw new Error('Question cannot be empty');
        }

        const response = await this.aiService.askQuestion(question);
        
        try {
            return JSON.parse(response);
        } catch (error) {
            // Fallback in case AI doesn't return strictly JSON
            return {
                answer: response,
                steps: [],
                relatedTerms: []
            };
        }
    }
}
