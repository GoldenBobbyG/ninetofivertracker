import dotenv from 'dotenv';
dotenv.config();


import pg from 'pg';
const { Client } = pg;
console.log(process.env.DB_PASSWORD);

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined

});

const connectToDb = async () => {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database', error);
      process.exit(1);
    }
}

client.connect();

export { client, connectToDb };
