import express from 'express';
import { connectToDb } from './connection.js';
await connectToDb();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
