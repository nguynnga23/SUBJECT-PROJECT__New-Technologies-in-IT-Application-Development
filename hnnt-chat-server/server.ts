import express, { Request, Response } from 'express';
import dotenv, { config } from 'dotenv';
import cors from 'cors';
import { Client } from 'pg';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Node.js!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
