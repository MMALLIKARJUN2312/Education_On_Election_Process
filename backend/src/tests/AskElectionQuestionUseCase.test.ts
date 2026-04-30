import { AskElectionQuestionUseCase } from '../application/usecases/AskElectionQuestionUseCase';
import { IAIService } from '../domain/interfaces/IAIService';

describe('AskElectionQuestionUseCase', () => {
    let useCase: AskElectionQuestionUseCase;
    let mockAIService: jest.Mocked<IAIService>;
    let mockFirestoreService: any;

    beforeEach(() => {
        mockAIService = {
            askQuestion: jest.fn()
        };
        mockFirestoreService = {
            logQuery: jest.fn().mockResolvedValue(undefined)
        };
        useCase = new AskElectionQuestionUseCase(mockAIService, mockFirestoreService);
    });


    it('should return a parsed response when AI returns valid JSON', async () => {
        const mockResponse = JSON.stringify({
            answer: "You must be 18.",
            steps: ["Step 1"],
            relatedTerms: [{ term: "Age", definition: "18+" }]
        });
        mockAIService.askQuestion.mockResolvedValue(mockResponse);

        const result = await useCase.execute("age limit?");
        expect(result.answer).toBe("You must be 18.");
        expect(result.steps).toHaveLength(1);
    });

    it('should fallback gracefully when AI returns invalid JSON', async () => {
        mockAIService.askQuestion.mockResolvedValue("Just 18 years.");

        const result = await useCase.execute("age?");
        expect(result.answer).toBe("Just 18 years.");
        expect(result.steps).toHaveLength(0);
    });

    it('should throw error for empty question', async () => {
        await expect(useCase.execute("")).rejects.toThrow('Question cannot be empty');
    });

    it('should handle firestore logging failure gracefully', async () => {
        mockAIService.askQuestion.mockResolvedValue("{}");
        mockFirestoreService.logQuery.mockRejectedValue(new Error("Firestore down"));
        
        const result = await useCase.execute("test");
        expect(result).toBeDefined();
        // Should not throw error
    });
});
