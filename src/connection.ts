// This connect my dotenv file so that my files will by ignored by git. 
import dotenv from 'dotenv';
dotenv.config();

//This will import Postgres and connect to the database
import pg from 'pg';
const { Client } = pg;
console.log(process.env.DB_PASSWORD);

// This will create a new client that will connect to my dot env file with my information so that I can connect to the database
const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined

});
// This will connect to the database and if it fails it will console log an error message and exit the process
const connectToDb = async () => {
    try {
        console.log('connecting to the database', process.env.DB_DATABASE);
        await client.connect();
        console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database', error);
      process.exit(1);
    }
}

// This will export the client and connectToDb so that I connect to my cli.ts file. 
export { client, connectToDb };
