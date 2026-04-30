import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const transports: winston.transport[] = [
  new winston.transports.Console(),
];

if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
  transports.push(new LoggingWinston());
}

const logger = winston.createLogger({
  level: 'info',
  transports,
});

export default logger;
