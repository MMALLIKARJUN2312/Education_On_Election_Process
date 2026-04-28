import { IAIService } from '../../domain/interfaces/IAIService';
import { FirestoreService } from '../../infrastructure/database/FirestoreService';

export class AskElectionQuestionUseCase {
    private aiService: IAIService;
    private firestoreService: FirestoreService;

    constructor(aiService: IAIService, firestoreService: FirestoreService) {
        this.aiService = aiService;
        this.firestoreService = firestoreService;
    }

    /**
     * Executes the election question query through AI.
     * Time Complexity: O(T + P) where T is AI generation time and P is JSON parsing time.
     * Space Complexity: O(N) where N is the size of the AI response.
     */
    public async execute(question: string): Promise<any> {
        if (!question || question.trim() === '') {
            throw new Error('Question cannot be empty');
        }

        const response = await this.aiService.askQuestion(question);
        
        let result: any;
        try {
            result = JSON.parse(response);
        } catch (error) {
            // Fallback in case AI doesn't return strictly JSON
            result = {
                answer: response,
                steps: [],
                relatedTerms: []
            };
        }

        // Log the query asynchronously to Google Cloud Firestore
        this.firestoreService.logQuery(question, result).catch(() => {});

        return result;
    }
}

