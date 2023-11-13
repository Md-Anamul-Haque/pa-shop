import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { userType } from '@/types/tables.type';
export const handleUserGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear select * from users where org_code = 'org_1'
        const org_code = req.auth?.user?.org_code;
        const users: userType[] = (await pool.query("SELECT org_code,user_id,username,email,role,is_active FROM USERS WHERE org_code = $1", [org_code])).rows
        if (users && users.length) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                message: 'users list',
                payload: users // your can any data for responce
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NO_CONTENT',
            });
        }
    } catch (error) {
        return ResponseHandler(res, {
            resType: 'error',
            status: 'INTERNAL_SERVER_ERROR',
            message: (error as any)?.message || ''  //your can any message 
        });
    }
}