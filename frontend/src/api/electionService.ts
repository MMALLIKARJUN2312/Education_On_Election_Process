import axios from 'axios';

const API_BASE_URL = 'https://election-education-backend-jjgscd3gxa-uc.a.run.app/api/v1/election';

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
    throw new Error('Could not fetch the answer. Please try again.', { cause: error });
  }
};
