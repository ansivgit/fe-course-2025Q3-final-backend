import YAML from 'yaml';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express, { type Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { chatController, dictionaryController } from './controllers';
import { connectToDatabase } from './data-access';
import { errorAuthHandler, errorHandler, notFoundHandler } from './middleware';
import { authRouter, dataRouter, userRouter } from './routes';

import { CONSTANTS, ROUTES } from './constants';

// Init application
export const app = express();

// Basic middleware for processing JSON and cross-domain queries
app.use(cors());
app.use(express.json());

const documentPath = path.resolve('doc/api.yaml');
const file = fs.readFileSync(documentPath, 'utf8');
const swaggerDocument: Record<string, unknown> = YAML.parse(file);

// Connecting the Swagger UI interface via the path /api-docs
app.use(ROUTES.DOCS, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// A simple health check router
app.get(ROUTES.HEALTH, (_req, res: Response): void => {
  res.status(CONSTANTS.HTTP_STATUS_OK).json({ status: 'ok', message: 'The server is stable' });
});

app.use('/', authRouter);
app.use(ROUTES.DATA, dataRouter);
app.use(ROUTES.USER, userRouter);
//TODO: move methods to routes
app.get(ROUTES.DICTIONARIES, dictionaryController);
app.post(ROUTES.CHAT, chatController);

app.use(errorAuthHandler);
app.use(notFoundHandler);
app.use(errorHandler);

// Server startup function if not running on Vercel environment
if (process.env.VERCEL !== '1') {
  connectToDatabase().catch(console.error);
}
