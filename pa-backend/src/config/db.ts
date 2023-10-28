import { Pool } from 'pg';
import dev from '.';
const { database, host, password, port, user } = dev.db
const db = new Pool({
    host,
    user,
    port,
    database,
    password
})

export default db;