
import { pool } from "@/config/db"

export const lazy_workers = () => {
    setInterval(async () => {
        await pool.query('DELETE FROM user_session WHERE expires_at < NOW();')
    }, 36000000) // 1000*60*60*10 =36000000= 10h
}
