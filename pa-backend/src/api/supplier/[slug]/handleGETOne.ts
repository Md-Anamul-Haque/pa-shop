import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handleSupplierGETOne = async (req: Request, res: Response) => {
    try {
        // ... handle DELETE logic start hear
        const org_code = req.auth?.user?.org_code;
        const supp_id = req?.params?.slug;
        if (!org_code || !supp_id) {
            throw new Error('supp_id is required')
        }
        const { rows } = await pool.query('SELECT * FROM supplier WHERE org_code = $1 AND supp_id = $2', [org_code, supp_id]);

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