import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handleProductGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear
        const { page = 1, pageSize = 30, limit: paramsLimit, skip } = req.query;
        const offset = skip ? Number(skip) : (Number(page) - 1) * Number(pageSize);
        const limit = Number(paramsLimit || pageSize);
        const org_code = req.auth?.user?.org_code
        // Query to fetch products with pagination
        const bar_qr_code = req.query.bar_qr_code as string || '';
        console.log({ bar_qr_code });
        const searchTerm = req.query.search as string || '';
        console.log({ searchTerm });
        let products: any;
        const query = bar_qr_code ?
            `SELECT * FROM product WHERE bar_qr_code=$1 AND org_code = $2`
            : `
        SELECT
          *
        FROM product
        WHERE 
          (LOWER(prod_id::TEXT || prod_name || prod_type) LIKE $1
          OR LOWER(brand || category||bar_qr_code) LIKE $1
          OR price::TEXT LIKE $1)
          AND org_code = $2
        ORDER BY updated_at DESC
        LIMIT $3 OFFSET $4;
      `;
        if (bar_qr_code) {
            const { rows } = await pool.query(query, [bar_qr_code, org_code]);
            products = rows;
        } else {
            const { rows } = await pool.query(query, [`%${searchTerm.toLowerCase()}%`, org_code, limit, offset]);
            products = rows;
        }
        console.log({ products })
        if (products) {
            const { rows: totalRow } = await pool.query('select count(prod_id) as total_row from product where org_code= $1;', [org_code]);
            const total_row = Number(totalRow?.[0]?.total_row)
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: {
                    products,
                    total_row,
                    hasMore: total_row > (products.length + offset)
                } // your can any data for responce
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