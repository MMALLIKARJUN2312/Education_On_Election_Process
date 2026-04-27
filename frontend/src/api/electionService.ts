import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/election';

export interface AIResponse {
  answer: string;
  steps: string[];
  relatedTerms: { term: string; definition: string }[];
}

export const askElectionQuestion = async (question: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ask`, { question });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Could not fetch the answer. Please try again.');
  }
};
