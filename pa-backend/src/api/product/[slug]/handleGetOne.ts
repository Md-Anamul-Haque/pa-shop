import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handleProductGETOne = async (req: Request, res: Response) => {
    try {
        // ... handle DELETE logic start hear
        const org_code = req.auth?.user?.org_code;
        const prod_id = req?.params?.slug;
        if (!org_code || !prod_id) {
            throw new Error('prod_id is required')
        }
        const { rows } = await pool.query('SELECT * FROM product WHERE org_code = $1 AND prod_id = $2', [org_code, prod_id]);

        if (rows[0]?.length) {
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