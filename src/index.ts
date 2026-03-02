import YAML from 'yaml';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { chatController } from './controllers/chat.controller';
import { dictionaryController } from './controllers/dictionary.controller';
import { errorAuthHandler, errorHandler, notFoundHandler } from './middleware';
import { authRouter } from './routes';

import { CONSTANTS, ROUTES } from './constants';

// Init application
export const app = express();
const port = process.env.PORT ?? CONSTANTS.DEFAULT_PORT;

// Basic middleware for processing JSON and cross-domain queries
app.use(cors());
app.use(express.json());

const documentPath = path.resolve('doc/api.yaml');
const file = fs.readFileSync(documentPath, 'utf8');
const swaggerDocument: Record<string, unknown> = YAML.parse(file);

// Connecting the Swagger UI interface via the path /api-docs
app.use(ROUTES.DOCS, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', authRouter);
app.get(ROUTES.DICTIONARIES, dictionaryController);
app.post(ROUTES.CHAT, chatController);

export const healthCheckHandler = (_request: Request, res: Response): void => {
  res.status(CONSTANTS.HTTP_STATUS_OK).json({ status: 'ok', message: 'The server is stable' });
};

// A simple health check router
app.get(ROUTES.HEALTH, healthCheckHandler);

app.use(errorAuthHandler);
app.use(notFoundHandler);
app.use(errorHandler);

// Server startup function
export const startServer = (): void => {
  app.listen(port, () => {
    console.warn(`Server is running on http://localhost:${String(port)}`);
    console.warn(`Swagger API docs: http://localhost:${String(port)}/docs`);
  });
};

startServer();
