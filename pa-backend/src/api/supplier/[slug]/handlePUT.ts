import db from '@/config/db';
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
export const handleSupplierPUT = async (req: Request, res: Response) => {
    try {
        // ... handle PUT logic start hear
        const org_code = req.auth?.user?.org_code;
        const supp_id = req?.params?.slug;

        const { supp_name, address, phone, email }: supplierType = req.body;
        // check validation
        const { error: validationError } = schema.validate({ org_code, supp_name, address, phone, email });
        if (validationError) {
            throw new Error(validationError.details[0].message)
        }
        // start Check if the supplier name already exists
        const checkResult = await db.query('SELECT * FROM supplier WHERE org_code = $1 AND supp_name = $2 AND address = $3', [
            org_code,
            supp_name,
            address
        ]);
        if (checkResult.rows.length > 0) {
            // supplier already exists, return appropriate response
            return ResponseHandler(res, {
                resType: 'error',
                status: 'BAD_REQUEST',
                message: 'supplier name already exists'
            });
        }
        // end of Check if the supplier name already exists
        const query = 'UPDATE supplier SET supp_name = $1, address = $2, phone=$3, email=$4, updated_at = NOW() WHERE org_code = $5 AND supp_id = $6 RETURNING *';
        const { rows } = await db.query(query, [supp_name, address, phone, email, org_code, supp_id])

        if (rows[0]) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: rows[0] // your can any data for responce
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