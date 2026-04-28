import { FirestoreService } from '../infrastructure/database/FirestoreService';
import { Firestore } from '@google-cloud/firestore';

jest.mock('@google-cloud/firestore');

describe('FirestoreService', () => {
    let service: FirestoreService;
    let mockFirestore: any;

    beforeEach(() => {
        mockFirestore = {
            collection: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            get: jest.fn(),
            add: jest.fn()
        };
        (Firestore as unknown as jest.Mock).mockImplementation(() => mockFirestore);
        service = new FirestoreService();
    });

    it('should fetch timeline events', async () => {
        mockFirestore.get.mockResolvedValue({
            empty: false,
            docs: [
                { data: () => ({ title: 'Event 1', description: 'Desc 1', order: 1 }) }
            ]
        });

        const result = await service.getElectionTimeline();
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Event 1');
    });

    it('should log queries correctly', async () => {
        mockFirestore.add.mockResolvedValue({ id: '123' });
        
        await service.logQuery('test?', { answer: 'ok' });
        expect(mockFirestore.collection).toHaveBeenCalledWith('queries');
        expect(mockFirestore.add).toHaveBeenCalled();
    });
});
