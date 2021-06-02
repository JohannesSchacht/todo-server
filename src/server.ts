/**
 * Required External Modules
 */

import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { tasksRouter } from './tasks/tasks.router';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { loggingHandler } from './middleware/logging.middelware';

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
    console.log('No port specified');
    process.exit(1);
}
export const HOSTNAME = process.env.HOSTNAME || 'localhost';
export const PORT: number = parseInt(process.env.PORT as string, 10);
export const app = express();

/**
 *  App Configuration
 */
app.use(loggingHandler);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/todo/tasks', tasksRouter);

app.use(errorHandler);
app.use(notFoundHandler);
