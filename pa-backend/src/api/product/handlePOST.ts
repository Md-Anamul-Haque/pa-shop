import db from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { productType } from '@/types/tables.type';
import Joi from 'joi';
const schema = Joi.object({
    org_code: Joi.string(),
    prod_name: Joi.string().required(),
    prod_type: Joi.string().required(),
    uom: Joi.string().required(),
    price: Joi.number().required(),
    brand: Joi.string(),
    category: Joi.string(),
    bar_qr_code: Joi.string()
});
export const handleProductPOST = async (req: Request, res: Response) => {
    try {
        // ... handle POST logic start hear

        const org_code = req.auth?.user?.org_code;

        const { prod_name, prod_type, uom, price, bar_qr_code, brand, category }: productType = req.body;
        // check validation
        const { error: validationError } = schema.validate({ org_code, prod_name, prod_type, uom, price, bar_qr_code, brand, category });
        if (validationError) {
            throw new Error(validationError.details[0].message)
        }
        // start Check if the product name already exists
        const checkResult = await db.query('SELECT * FROM product WHERE org_code = $1 AND prod_name = $2', [
            org_code,
            prod_name,
        ]);
        if (checkResult.rows.length > 0) {
            // Product already exists, return appropriate response
            return ResponseHandler(res, {
                resType: 'error',
                status: 'BAD_REQUEST',
                message: 'Product name already exists'
            });
        }
        // end of Check if the product name already exists


        const subQuery_forProductId = String(`(
            SELECT 
              CASE 
                WHEN COUNT(*) = 0 OR MAX(CASE WHEN org_code = '${org_code}' THEN 1 ELSE 0 END) = 0 
                THEN 'PROD_1'
                ELSE 'PROD_' || (COALESCE(
                  MAX(CAST(SPLIT_PART(prod_id, '_', 2) AS INTEGER)), 0) + 1)::TEXT
              END
            FROM 
              product 
          )
          `);
        const query = `
      INSERT INTO product (org_code, prod_id, prod_name, prod_type, price, uom, brand, category, bar_qr_code)
      VALUES (
        $1,
        ${subQuery_forProductId},
         $2,
          $3,
           $4,
            $5,
             $6,
              $7,
               $8
               )
      RETURNING *;
    `;
        const { rows } = await db.query(query, [org_code, prod_name, prod_type, price, uom, brand, category, bar_qr_code]);

        const newProduct = rows[0];

        if (newProduct) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'CREATED',
                payload: newProduct // your can any data for responce
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