import { Pool } from 'pg';

const pool = new Pool({
    username: process.env.username,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
});

export default pool;
