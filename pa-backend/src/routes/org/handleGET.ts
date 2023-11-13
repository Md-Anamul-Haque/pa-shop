import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handleOrgGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear
        const orgs = await pool.query('select * from org ')



        if (orgs?.rows) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                message: '',
                payload: orgs.rows
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
        })
    }
}