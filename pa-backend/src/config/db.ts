import { Client, Pool } from 'pg';
import postgres from 'postgres';
import dev from '.';
const { database, host, password, port, user } = dev.db
export const pool = new Pool({
    host,
    user,
    port,
    database,
    password
});
export const client = new Client({
    host,
    user,
    port,
    database,
    password
});

export const sql = postgres({
    host,
    user,
    port,
    database,
    password
});




const db = pool;
export default db;