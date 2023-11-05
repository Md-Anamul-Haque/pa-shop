import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { orgType } from '@/types/tables.type';
export const handleOrgPOST = async (req: Request, res: Response) => {
    try {
        // ... handle POST logic start hear

        const { org_code, org_name, is_active }: orgType = req.body
        const createOrg = await pool.query('insert into ORG (org_code, org_name, is_active) VALUES($1,$2,$3) RETURNING *', [org_code, org_name, is_active])
        const newOrg: orgType = createOrg.rows[0];

        if (newOrg) {
            return ResponseHandler(res, {
                status: 'CREATED',
                payload: newOrg // your can any data for responce
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_IMPLEMENTED',
                message: 'error message'  //your can any message'
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