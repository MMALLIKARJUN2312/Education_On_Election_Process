import request from 'supertest';
import app from '../app';

// Mock the AI and Firestore services to avoid external calls and ensure deterministic tests
jest.mock('../infrastructure/ai/VertexAIService', () => {
    return {
        VertexAIService: jest.fn().mockImplementation(() => {
            return {
                askQuestion: jest.fn().mockResolvedValue(JSON.stringify({
                    answer: "Test answer",
                    steps: ["Step 1"],
                    relatedTerms: [{ term: "Test", definition: "Test def" }]
                }))
            };
        })
    };
});

jest.mock('../infrastructure/database/FirestoreService', () => {
    return {
        FirestoreService: jest.fn().mockImplementation(() => {
            return {
                getElectionTimeline: jest.fn().mockResolvedValue([
                    { title: "Test Event", description: "Test Desc", order: 1 }
                ]),
                logQuery: jest.fn().mockResolvedValue(undefined)
            };

        })
    };
});

describe('Election API Integration Tests', () => {
    
    describe('GET /health', () => {
        it('should return 200 OK', async () => {
            const res = await request(app).get('/health');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('OK');
        });
    });

    describe('GET /api/v1/election/timeline', () => {
        it('should return the timeline from Firestore', async () => {
            const res = await request(app).get('/api/v1/election/timeline');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].title).toBe("Test Event");
        });
    });

    describe('POST /api/v1/election/ask', () => {
        it('should return 200 and a valid AI response for a valid question', async () => {
            const res = await request(app)
                .post('/api/v1/election/ask')
                .send({ question: "How do I register to vote?" });
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('answer');
            expect(res.body).toHaveProperty('steps');
        });

        it('should return 400 for an empty question', async () => {
            const res = await request(app)
                .post('/api/v1/election/ask')
                .send({ question: "" });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        it('should return 400 for a question that is too long', async () => {
            const longQuestion = 'a'.repeat(501);
            const res = await request(app)
                .post('/api/v1/election/ask')
                .send({ question: longQuestion });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        it('should return 400 for a non-string question', async () => {
            const res = await request(app)
                .post('/api/v1/election/ask')
                .send({ question: 123 });
            
            expect(res.status).toBe(400);
        });
    });
});
