import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { chatController } from './controllers/chat.controller';

const DEFAULT_PORT = 3000;
const HTTP_STATUS_OK = 200;

// Init application
export const app = express();
const port = process.env.PORT ?? DEFAULT_PORT;

// Basic middleware for processing JSON and cross-domain queries
app.use(cors());
app.use(express.json());

const documentPath = path.resolve('doc/api.yaml');
const file = fs.readFileSync(documentPath, 'utf8');
const swaggerDocument: Record<string, unknown> = YAML.parse(file);

// Connecting the Swagger UI interface via the path /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/api/chat', chatController);

export const healthCheckHandler = (_request: Request, res: Response): void => {
  res.status(HTTP_STATUS_OK).json({ status: 'ok', message: 'The server is stable' });
};

// A simple health check router
app.get('/health', healthCheckHandler);

// Server startup function
export const startServer = (): void => {
  app.listen(port, () => {
    console.warn(`Server is running on http://localhost:${String(port)}`);
    console.warn(`Swagger API docs: http://localhost:${String(port)}/api-docs`);
  });
};

startServer();
