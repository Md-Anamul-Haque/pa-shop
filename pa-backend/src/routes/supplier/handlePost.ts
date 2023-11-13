import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { supplierType } from '@/types/tables.type';
import Joi from 'joi';
const schema = Joi.object({
    org_code: Joi.string(),
    supp_name: Joi.string().required(),
    address: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email()
});
export const handleSupplierPOST = async (req: Request, res: Response) => {
    try {
        // ... handle POST logic start hear
        const org_code = req.auth?.user?.org_code;
        const { supp_name, address, phone, email }: supplierType = req.body;
        // check validation
        const { error: validationError } = schema.validate({ org_code, supp_name, address, phone, email });
        if (validationError) {
            throw new Error(validationError.details[0].message)
        }
        // start Check if the supplier name already exists
        const checkResult = await pool.query('SELECT * FROM supplier WHERE org_code = $1 AND supp_name = $2 AND phone = $3', [
            org_code,
            supp_name,
            phone
        ]);
        if (checkResult.rows.length > 0) {
            // supplier already exists, return appropriate response
            return ResponseHandler(res, {
                resType: 'error',
                status: 'BAD_REQUEST',
                message: 'this supplier (name,phone) already exists :' + checkResult.rows[0]?.supp_id
            });
        }
        // end of Check if the supplier name already exists

        const subQuery_forSupplierId = String(`(
            SELECT 
              CASE 
                WHEN COUNT(*) = 0 OR MAX(CASE WHEN org_code = '${org_code}' THEN 1 ELSE 0 END) = 0 
                THEN 'SUP_1'
                ELSE 'SUP_' || (COALESCE(
                  MAX(CAST(SPLIT_PART(supp_id, '_', 2) AS INTEGER)), 0) + 1)::TEXT
              END
            FROM 
              supplier 
          )
          `);

        const query = `
          INSERT INTO supplier (org_code,supp_id, supp_name, address, phone, email)
          VALUES (
            $1,
            ${subQuery_forSupplierId},
             $2,
              $3,
               $4,
                $5
                   )
          RETURNING *;
        `;
        const { rows } = await pool.query(query, [org_code, supp_name, address, phone, email]);


        if (rows[0]) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'CREATED',
                payload: rows[0] // your can any data for responce
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_IMPLEMENTED',
                message: 'not INSERTED'  //your can any message'
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