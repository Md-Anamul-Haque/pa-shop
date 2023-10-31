import db from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { customerType } from '@/types/tables.type';
import Joi from 'joi';
const schema = Joi.object<customerType>({
    org_code: Joi.string(),
    cust_name: Joi.string().required(),
    address: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email()
});
export const handleCustomerPOST = async (req: Request, res: Response) => {
    try {
        // ... handle POST logic start hear
        const org_code = req.auth?.user?.org_code;
        const { cust_name, address, phone, email }: customerType = req.body;
        // check validation
        const { error: validationError } = schema.validate({ org_code, cust_name, address, phone, email });
        if (validationError) {
            throw new Error(validationError.details[0].message)
        }
        // start Check if the customer name already exists
        const checkResult = await db.query('SELECT * FROM customer WHERE org_code = $1 AND supp_name = $2 AND address = $3', [
            org_code,
            cust_name,
            address
        ]);
        if (checkResult.rows.length > 0) {
            // customer already exists, return appropriate response
            return ResponseHandler(res, {
                resType: 'error',
                status: 'BAD_REQUEST',
                message: 'customer name already exists'
            });
        }
        // end of Check if the customer name already exists


        const subQuery_forCustomerId = String(`(
            SELECT 
              CASE 
                WHEN COUNT(*) = 0 OR MAX(CASE WHEN org_code = '${org_code}' THEN 1 ELSE 0 END) = 0 
                THEN 'cus_1'
                ELSE 'cus_' || (COALESCE(
                  MAX(CAST(SPLIT_PART(cust_id, '_', 2) AS INTEGER)), 0) + 1)::TEXT
              END
            FROM 
              customer 
          )
          `);
        const query = `
          INSERT INTO customer (org_code,cust_id, cust_name, address, phone, email)
          VALUES (
            $1,
            ${subQuery_forCustomerId},
             $2,
              $3,
               $4,
                $5
                   )
          RETURNING *;
        `;
        const { rows } = await db.query(query, [org_code, cust_name, address, phone, email]);


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