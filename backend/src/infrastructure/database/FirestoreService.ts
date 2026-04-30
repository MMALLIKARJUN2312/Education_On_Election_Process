import { Firestore } from '@google-cloud/firestore';
import logger from '../logging/logger';

export interface TimelineEvent {
    title: string;
    description: string;
    order: number;
}

export class FirestoreService {
    private db: Firestore;
    private timelineCache: TimelineEvent[] | null = null;
    private cacheExpiry: number = 0;
    private readonly CACHE_TTL = 3600000; // 1 hour

    constructor() {
        this.db = new Firestore({
            projectId: process.env.GOOGLE_CLOUD_PROJECT || 'mock-project',
        });
    }

    /**
     * Retrieves the election timeline from Firestore.
     * Time Complexity: O(E) where E is the number of events fetched.
     * Space Complexity: O(E) to store and return the timeline array.
     */
    async getElectionTimeline(): Promise<TimelineEvent[]> {
        // Efficiency: Use in-memory cache to reduce Firestore reads and improve latency
        if (this.timelineCache && Date.now() < this.cacheExpiry) {
            return this.timelineCache;
        }

        try {
            const snapshot = await this.db.collection('election_timeline').orderBy('order', 'asc').get();
            let timeline: TimelineEvent[];

            if (snapshot.empty) {
                // Return default if Firestore hasn't been seeded yet
                timeline = [
                    { title: "Registration", description: "Register as a voter", order: 1 },
                    { title: "Verification", description: "Check name in list", order: 2 },
                    { title: "Election Day", description: "Go to booth and vote", order: 3 }
                ];
            } else {
                timeline = snapshot.docs.map(doc => doc.data() as TimelineEvent);
            }

            // Update cache
            this.timelineCache = timeline;
            this.cacheExpiry = Date.now() + this.CACHE_TTL;

            return timeline;
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


