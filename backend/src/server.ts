import * as profiler from '@google-cloud/profiler';
import * as traceAgent from '@google-cloud/trace-agent';

// Initialize Google Cloud Observability tools first (production only)
if (process.env.NODE_ENV === 'production') {
    profiler.start({
      serviceContext: {
        service: 'election-education-backend',
        version: '1.0.0',
      },
    });
    traceAgent.start();
}



import app from './app';
import logger from './infrastructure/logging/logger';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
});

