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
        // Query to fetch sales with pagination
        //         const query = `
        //     SELECT sales_id,cust_id,sales_date FROM sales_mt
        //     WHERE org_code = $1
        //     ORDER BY updated_at
        //     LIMIT $2 OFFSET $3;
        //   `;
        const query = `
        SELECT 
    mt.sales_id,
    -- mt.cust_id,
    mt.discount,
    mt.vat,
    mt.paid_amt,
    cust.cust_name,
    mt.sales_date,
    (SELECT SUM(dt.unit_price * dt.qty) FROM sales_dt dt WHERE dt.sales_id = mt.sales_id AND dt.org_code = mt.org_code) AS total_sales_amount
FROM 
    sales_mt mt
JOIN 
    customer cust ON mt.org_code = cust.org_code AND mt.cust_id = cust.cust_id
WHERE 
    mt.org_code = $1
ORDER BY 
    mt.updated_at
LIMIT 
    $2 OFFSET $3;

`;
        const { rows: sales } = await pool.query(query, [org_code, limit, offset]);
        if (sales) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: sales // your can any data for responce
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