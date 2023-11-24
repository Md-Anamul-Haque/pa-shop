
// handleStockGet
import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { auth } from '@/helpers/auth';
import { type Request, type Response } from '@/types/request&responce.type';
const handleStockGet = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear
        const { page = 1, pageSize = 30, limit: paramsLimit, skip } = req.query;
        const offset = skip ? Number(skip) : (Number(page) - 1) * Number(pageSize);
        const limit = Number(paramsLimit || pageSize);

        const org_code = req.auth?.user?.org_code
        // Query to fetch stocks with pagination
        const bar_qr_code = req.query.bar_qr_code as string || '';
        console.log({ bar_qr_code });
        const searchTerm = req.query.search as string || '';
        console.log({ searchTerm });
        let stocks: any;

        const query = bar_qr_code ?
            `SELECT prod_id,prod_name,qty,uom,prod_type,brand,price FROM stock_vw WHERE bar_qr_code=$1 AND org_code = $2`
            : `
        SELECT
            prod_id,prod_name,qty,uom,prod_type,brand,price
        FROM stock_vw
        WHERE 
          (LOWER(prod_id::TEXT || prod_name || prod_type) LIKE $1
          OR LOWER(brand || category||bar_qr_code) LIKE $1
          OR price::TEXT LIKE $1)
          AND org_code = $2
        LIMIT $3 OFFSET $4;
      `;
        if (bar_qr_code) {
            const { rows } = await pool.query(query, [bar_qr_code, org_code]);
            stocks = rows;
        } else {
            const { rows } = await pool.query(query, [`%${searchTerm.toLowerCase()}%`, org_code, limit, offset]);
            stocks = rows;
        }
        if (stocks) {
            const { rows: totalRow } = await pool.query('select count(prod_id) as total_row from stock_vw where org_code= $1;', [org_code]);
            const total_row = Number(totalRow?.[0]?.total_row)
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: { stocks, total_row, hasMore: total_row > (stocks.length + offset), } // your can any data for responce
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
export const GET = [auth, handleStockGet]