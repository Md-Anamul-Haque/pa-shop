import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handleSupplierGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear
        const { page = 1, pageSize = 30, limit: paramsLimit, skip } = req.query;
        const org_code = req.auth?.user?.org_code;
        const offset = skip ? Number(skip) : (Number(page) - 1) * Number(pageSize);

        const limit = Number(paramsLimit || pageSize);

        let searchTerm = req.query.search as string || '';
        searchTerm = searchTerm.replace(/\s+/g, ' ').trim();
        searchTerm = searchTerm === 'undefined' ? '' : searchTerm;
        console.log({ searchTerm, offset, limit })
        const query = `SELECT
        *
      FROM supplier
      WHERE 
        (LOWER(supp_id::TEXT || supp_name || address) LIKE $1
        OR LOWER( phone || email) LIKE $1)
        AND org_code = $2
      ORDER BY updated_at DESC
      LIMIT $3 OFFSET $4;
    `
        console.log({ searchTerm })
        const { rows } = await pool.query(query, [`%${searchTerm.toLowerCase()}%`, org_code, limit, offset]);
        // const { rows } = await pool.query('select * from supplier where org_code= $1  ORDER BY updated_at DESC LIMIT $2 OFFSET $3;', [org_code, limit, offset]);
        if (rows.length) {
            const { rows: totalRow } = await pool.query('select count(*) as total_row from supplier where org_code= $1;', [org_code]);
            const total_row = Number(totalRow?.[0]?.total_row)
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: {
                    supplier: rows,
                    total_row,
                    hasMore: total_row > (rows.length + offset),
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