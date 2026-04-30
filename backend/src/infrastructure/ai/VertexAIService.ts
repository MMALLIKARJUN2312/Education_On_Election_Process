import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import { IAIService } from '../../domain/interfaces/IAIService';

export class VertexAIService implements IAIService {
    private vertexAI: VertexAI;
    private generativeModel: any;

    /**
     * Initializes the Vertex AI generative model with strict safety settings
     * and system instructions for impartial civic education.
     */
    constructor() {
        const project = process.env.GOOGLE_CLOUD_PROJECT || 'mock-project';
        const location = process.env.VERTEX_AI_LOCATION || 'us-central1';
        console.log(`Initializing VertexAI with Project: ${project}, Location: ${location}`);

        this.vertexAI = new VertexAI({
            project: project,
            location: location
        });

        this.generativeModel = this.vertexAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.1, // Lower temperature for more deterministic/factual answers
            },

            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                }
            ],
            systemInstruction: {
                role: 'system',
                parts: [{
                    text: `You are an impartial, highly accurate civic education assistant. Your ONLY purpose is to explain election processes, rules, and civic duties. 
STRICT CONSTRAINTS:
1. NEVER express a political opinion, bias, or preference.
2. NEVER mention real-world political parties, candidates, or current events.
3. NEVER persuade or advise the user on who to vote for.
4. Use simple, accessible language (at a 6th-grade reading level) to ensure it is understandable for first-time voters.
5. Provide the output strictly in valid JSON format matching this schema:
{
  "answer": "A clear, concise explanation",
  "steps": ["Step 1", "Step 2"],
  "relatedTerms": [{"term": "definition"}]
}
If the user's prompt violates these constraints, return a JSON with "answer": "I can only provide factual, neutral information about the election process."`
                }]
            }
        });
    }

    public async askQuestion(prompt: string): Promise<string> {
        try {
            const req = {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            };
            const response = await this.generativeModel.generateContent(req);
            const textResponse = response.response.candidates[0].content.parts[0].text;
            
            // Robust JSON extraction using regex
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            return jsonMatch ? jsonMatch[0] : textResponse;
        } catch (error: any) {
            console.error("AI Service Error:", error.message);
            throw new Error("Failed to process the request with AI.");
        }
    }
}
