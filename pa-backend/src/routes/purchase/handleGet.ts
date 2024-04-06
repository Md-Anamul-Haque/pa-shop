// handlePurchaseGET
import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handlePurchaseGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(pageSize);
        const limit = Number(pageSize);
        const org_code = req.auth?.user?.org_code
        // Query to fetch purchases with pagination
        //         const query = `
        //     SELECT pur_id,supp_id,pur_date FROM purchase_mt
        //     WHERE org_code = $1
        //     ORDER BY updated_at
        //     LIMIT $2 OFFSET $3;
        //   `;
        const query = `
        SELECT 
    mt.pur_id,
    -- mt.supp_id,
    mt.discount,
    mt.vat,
    mt.paid_amt,
    sup.supp_name,
    mt.pur_date,
    (SELECT SUM(dt.unit_price * dt.qty) FROM purchase_dt dt WHERE dt.pur_id = mt.pur_id AND dt.org_code = mt.org_code) AS total_purchase_amount
FROM 
    purchase_mt mt
JOIN 
    supplier sup ON mt.org_code = sup.org_code AND mt.supp_id = sup.supp_id
WHERE 
    mt.org_code = $1
ORDER BY 
    mt.updated_at
LIMIT 
    $2 OFFSET $3;

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