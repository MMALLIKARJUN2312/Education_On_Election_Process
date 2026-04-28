import { Firestore } from '@google-cloud/firestore';
import logger from '../logging/logger';

export interface TimelineEvent {
    title: string;
    description: string;
    order: number;
}

export class FirestoreService {
    private db: Firestore;

    constructor() {
        this.db = new Firestore({
            projectId: process.env.GOOGLE_CLOUD_PROJECT,
        });
    }

    /**
     * Retrieves the election timeline from Firestore.
     * Time Complexity: O(E) where E is the number of events fetched.
     * Space Complexity: O(E) to store and return the timeline array.
     */
    async getElectionTimeline(): Promise<TimelineEvent[]> {
        try {
            const snapshot = await this.db.collection('election_timeline').orderBy('order', 'asc').get();
            if (snapshot.empty) {
                // Return default if Firestore hasn't been seeded yet
                return [
                    { title: "Registration", description: "Register as a voter", order: 1 },
                    { title: "Verification", description: "Check name in list", order: 2 },
                    { title: "Election Day", description: "Go to booth and vote", order: 3 }
                ];
            }
            return snapshot.docs.map(doc => doc.data() as TimelineEvent);
        } catch (error: any) {
            logger.error(`Firestore Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Logs a user query to Firestore for analysis (stateless/anonymous).
     */
    async logQuery(question: string, answer: any): Promise<void> {
        try {
            await this.db.collection('queries').add({
                question,
                timestamp: new Date(),
                success: !!answer
            });
            logger.info("Query logged to Firestore");
        } catch (error: any) {
            logger.error(`Firestore Logging Error: ${error.message}`);
        }
    }
}


