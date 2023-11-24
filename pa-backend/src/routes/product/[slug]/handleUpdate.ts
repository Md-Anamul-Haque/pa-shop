import { pool } from '@/config/db';
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
    brand: Joi.string().allow('').optional(),
    category: Joi.string().allow('').optional(),
    bar_qr_code: Joi.string().allow('').optional(),
});
export const handleProductPUT = async (req: Request, res: Response) => {
    try {
        // ... handle PUT logic start hear
        const org_code = req.auth?.user?.org_code;
        const prod_id = req?.params?.slug;
        const { prod_name, prod_type, uom, price, bar_qr_code = '', brand, category }: productType = req.body;
        const { error: validationError } = schema.validate({ org_code, prod_name, prod_type, uom, price, bar_qr_code, brand, category });
        if (validationError) {
            throw new Error(validationError.details[0].message)
        }
        // // start Check if the product name already exists
        // const checkResult = await pool.query('SELECT * FROM product WHERE org_code = $1 AND prod_id = $2', [
        //     org_code,
        //     prod_id,
        // ]);
        // if (checkResult.rows.length === 0) {
        //     // Product already exists, return appropriate response
        //     return ResponseHandler(res, {
        //         resType: 'error',
        //         status: 'NOT_FOUND',
        //         message: 'Product prod_id not exists'
        //     });
        // }

        const { rows } = await pool.query(
            'UPDATE product SET prod_name = $1, prod_type = $2, price = $3, uom = $4, brand = $5, category = $6, bar_qr_code = $7, updated_at = NOW() WHERE org_code = $8 AND prod_id = $9 RETURNING *',
            [
                prod_name,
                prod_type,
                price,
                uom,
                brand,
                category,
                bar_qr_code,
                org_code,
                prod_id,
            ]
        );
        const updateProduct = rows[0];
        if (updateProduct) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                message: 'Product updated successfully',
                payload: updateProduct // your can any data for responce
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_FOUND',
                message: 'Product NOT_FOUND'  //your can any message'
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