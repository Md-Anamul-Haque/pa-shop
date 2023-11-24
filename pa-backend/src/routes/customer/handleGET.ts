import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handleCustomerGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(pageSize);
        const limit = Number(pageSize);
        const org_code = req.auth?.user?.org_code;
        const searchTerm = req.query.search as string || '';

        const query = `
        SELECT
          *
        FROM customer
        WHERE 
          (LOWER(cust_id::TEXT || cust_name || address) LIKE $1
          OR LOWER(phone || email) LIKE $1)
          AND org_code = $2
        ORDER BY updated_at DESC
        LIMIT $3 OFFSET $4;
      `
        const { rows } = await pool.query(query, [`%${searchTerm.toLowerCase()}%`, org_code, limit, offset]);

        if (rows?.length) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: rows // your can any data for responce
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