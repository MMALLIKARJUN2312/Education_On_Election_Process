export interface IAIService {
    askQuestion(prompt: string): Promise<string>;
}
