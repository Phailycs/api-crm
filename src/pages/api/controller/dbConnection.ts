const mongoose = require('mongoose');
import { Db, MongoClient } from 'mongodb';
const MONGO_USERNAME = process.env.DB_USER || '';
const MONGO_PASSWORD = process.env.DB_PASSWORD || '';
const MONGO_DB = process.env.DB_DATABASE || '';
const MONGO_URL = 'mongodb+srv://' + MONGO_USERNAME + ':' + MONGO_PASSWORD + '@cluster0.ovh2vyd.mongodb.net/' + MONGO_DB + '?retryWrites=true&w=majority';

if (!MONGO_URL) {
    throw new Error('Define the MONGODB_URI environmental variable');
}

if (!MONGO_DB) {
    throw new Error('Define the MONGODB_DB environmental variable');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return {
            client: cachedClient,
            db: cachedDb,
        };
    }

    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    let client = new MongoClient(MONGO_URL);
    await client.connect();
    let db = client.db(MONGO_DB);

    cachedClient = client;
    cachedDb = db;

    return {
        client: cachedClient,
        db: cachedDb,
    };
}