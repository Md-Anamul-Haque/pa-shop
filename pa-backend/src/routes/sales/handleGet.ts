// handlePurchaseGET
import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handleSalesGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(pageSize);
        const limit = Number(pageSize);
        const org_code = req.auth?.user?.org_code
        // Query to fetch purchases with pagination
        const query = `
    SELECT sales_id,cust_id,sales_date FROM sales_mt
    WHERE org_code = $1
    ORDER BY updated_at
    LIMIT $2 OFFSET $3;
  `;
        const { rows: purchases } = await pool.query(query, [org_code, limit, offset]);
        if (purchases) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: purchases // your can any data for responce
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