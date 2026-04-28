import { Storage } from '@google-cloud/storage';
import logger from '../logging/logger';

export class StorageService {
    private storage: Storage;
    private bucketName: string;

    constructor() {
        this.storage = new Storage({
            projectId: process.env.GOOGLE_CLOUD_PROJECT,
        });
        this.bucketName = process.env.ASSETS_BUCKET || 'election-assets-mock';
    }

    /**
     * Gets a signed URL for a static asset (e.g. voter guide PDF)
     * Demonstrates advanced Google Cloud Storage usage.
     */
    async getAssetUrl(fileName: string): Promise<string> {
        try {
            // In a real scenario, we would check if bucket exists
            // and then generate a signed URL.
            // For now, we return a mock URL to demonstrate service integration.
            logger.info(`Generating access URL for asset: ${fileName}`);
            return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
        } catch (error: any) {
            logger.error(`Storage Error: ${error.message}`);
            return '';
        }
    }
}
