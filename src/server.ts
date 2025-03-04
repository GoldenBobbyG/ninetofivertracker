import express from 'express';
import { QueryResult } from 'pg';
import { client, connectToDb } from './connection.js';

await connectToDb();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

