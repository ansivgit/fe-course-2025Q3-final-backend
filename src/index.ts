import YAML from 'yaml';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { MongoClient } from 'mongodb';
import swaggerUi from 'swagger-ui-express';

import { chatController } from './controllers/chat.controller';
import { dictionaryController } from './controllers/dictionary.controller';
import { errorAuthHandler, errorHandler, notFoundHandler } from './middleware';
import { authRouter } from './routes';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI not defined');
}
const client = new MongoClient(uri);

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

// biome-ignore lint/style/noDefaultExport: we need it for deploying to Vercel
export default app;

// Server startup function if not running on Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.warn(`Server is running on http://localhost:${String(port)}`);
    console.warn(`Swagger API docs: http://localhost:${String(port)}/docs`);
  });
}

async function run(): Promise<void> {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    // test connection
    const dbs = await client.db().admin().listDatabases();
    console.log('DBs:', dbs.databases.map((database) => database));

  } catch (error) {
    console.error('❌ Connection error:', error);
  } finally {
    await client.close();
  }
}

await run();
