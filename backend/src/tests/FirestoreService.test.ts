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

    it('should return from cache if available', async () => {
        mockFirestore.get.mockResolvedValue({
            empty: false,
            docs: [{ data: () => ({ title: 'Cached' }) }]
        });
        
        await service.getElectionTimeline();
        const result = await service.getElectionTimeline();
        
        // Should only call Firestore once
        expect(mockFirestore.get).toHaveBeenCalledTimes(1);
        expect(result[0].title).toBe('Cached');
    });

    it('should log queries correctly', async () => {
        mockFirestore.add.mockResolvedValue({ id: '123' });
        
        await service.logQuery('test?', { answer: 'ok' });
        expect(mockFirestore.collection).toHaveBeenCalledWith('queries');
        expect(mockFirestore.add).toHaveBeenCalled();
    });

    it('should return default timeline when snapshot is empty', async () => {
        mockFirestore.get.mockResolvedValue({ empty: true });
        const result = await service.getElectionTimeline();
        expect(result).toHaveLength(3);
        expect(result[0].title).toBe("Registration");
    });

    it('should handle getElectionTimeline errors', async () => {
        mockFirestore.get.mockRejectedValue(new Error("DB error"));
        const result = await service.getElectionTimeline();
        expect(result).toEqual([]);
    });

    it('should handle logQuery errors', async () => {
        mockFirestore.add.mockRejectedValue(new Error("Log error"));
        // Should catch internally and not throw
        await service.logQuery('test', {});
        expect(mockFirestore.add).toHaveBeenCalled();
    });
});
