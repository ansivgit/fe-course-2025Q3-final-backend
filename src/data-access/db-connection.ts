import { type Db, MongoClient } from 'mongodb';
import 'dotenv/config';

import { DatabaseError } from '../errors';

const { DB_NAME, NODE_ENV, MONGO_URI_DEV, MONGO_URI_PROD } = process.env;
const mongoUri = NODE_ENV === 'development' ? MONGO_URI_DEV : MONGO_URI_PROD;

if (!mongoUri) {
  throw new DatabaseError('Database URI is not defined');
}

const clientOptions = {
  serverSelectionTimeoutMS: 5000, // timeout for selecting a server - up to 15 seconds
  socketTimeoutMS: 45000, // timeout for network operations
  connectTimeoutMS: 10000, // timeout for establishing a connection
  retryWrites: true, // retry when network errors occur
  retryReads: true, // retry when network errors occur
  family: 4, // force IPv4 (helps with DNS issues)
};

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const MAX_RETRIES = 3;
const RETRY_INTERVAL_MS = 3000;

// try to connect to the database with multiple attempts
const createConnection = async (): Promise<{ client: MongoClient; db: Db }> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const client = new MongoClient(mongoUri, clientOptions);

      await client.connect();
      const db = client.db(DB_NAME ?? 'Tandem-mern');

      // check if the connection is working
      await db.command({ ping: 1 });
      console.info(`✅ Connected to MongoDB Atlas (attempt ${attempt})`);

      return { client, db };
    } catch (error) {
      if (error instanceof Error) {
        lastError = error;
      }
      console.error(`⚠️ Connection attempt ${attempt} failed:`, error);

      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
      }
    }
  }

  throw lastError ?? new Error('Database connection failed after multiple attempts');
};

export const connectToDatabase = async (): Promise<Db> => {
  // if the client is already connected, check if it's alive
  if (cachedClient && cachedDb) {
    try {
      await cachedDb.command({ ping: 1 });

      return cachedDb; // connection is alive
    } catch {
      console.error('⚠️ Connection to MongoDB is lost. Reconnecting...');

      try {
        await cachedClient.close();
      } catch {
        console.error('⚠️ Database connection failed. Please check the connection manually');
      }

      cachedClient = null;
      cachedDb = null;
    }
  }

  // create a new connection with multiple attempts
  console.info('⚙️ Connecting to MongoDB Atlas...');
  const { client, db } = await createConnection();
  cachedClient = client;
  cachedDb = db;

  // test DB connection
  const dbs = await client.db().admin().listDatabases();
  console.info(
    '🛢 Databases:',
    dbs.databases.map((database) => database.name),
  );

  return cachedDb;
};

/* From an architectural perspective, we need two functions: one for a new connection and one for retrieving an existing connection. For consistency, we can use a single function (to avoid code duplication) */
export const getDb = connectToDatabase;

// soft close connection
export const closeDbConnection = async(): Promise<void> => {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
};
