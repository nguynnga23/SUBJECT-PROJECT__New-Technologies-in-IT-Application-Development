import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔹 Connecting to PostgreSQL...');

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT) || 5432,
});

// pool.connect()
//     .then(() => console.log('✅ Connected to PostgreSQL'))
//     .catch((err) => console.error('❌ Database connection error:', err));

export default pool;
