import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { orgType } from '@/types/tables.type';
import Joi from 'joi';
const schema = Joi.object({
    org_name: Joi.string(),
    is_active: Joi.boolean().required()
});
export const handleOrgPOST = async (req: Request, res: Response) => {
    try {
        // ... handle POST logic start hear

        const { org_name, is_active }: orgType = req.body;
        const { error: validationError } = schema.validate({ org_name, is_active });
        if (validationError) {
            throw new Error(validationError.details[0].message)
        }
        // (SELECT 'org_'|| COALESCE(MAX(CAST(SPLIT_PART(org_code, '_', 2) AS INTEGER)), 0)+1 FROM ORG)"
        const subQuery_forORG_code = String(`(
            SELECT 
              CASE 
                WHEN COUNT(*) = 0
                THEN 'org_1'
                ELSE 'org_' || (COALESCE(
                  MAX(CAST(SPLIT_PART(org_code, '_', 2) AS INTEGER)), 0) + 1)::TEXT
              END
            FROM 
            ORG 
          )
          `);
        const createOrg = await pool.query(`insert into ORG (org_code, org_name, is_active) VALUES(${subQuery_forORG_code},$1,$2) RETURNING *`, [org_name, is_active])
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