import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handleCustomerGETOne = async (req: Request, res: Response) => {
    try {
        // ... handle DELETE logic start hear
        const org_code = req.auth?.user?.org_code;
        const cust_id = req?.params?.slug;
        const { rows } = await pool.query('SELECT * FROM customer WHERE org_code = $1 AND cust_id = $2', [org_code, cust_id]);

        if (rows[0]) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: rows[0]
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_FOUND',
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