import { pool, sql } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handleSaleschaseGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear
        const sales_id = req.params.slug;
        const org_code = req.auth?.user?.org_code as string;
        console.log({ org_code })
        const result = await pool.query(`
        SELECT
          jsonb_build_object(
            'customer', jsonb_build_object(
              'cust_id', c.cust_id,
              'cust_name', c.cust_name,
              'address', c.address,
              'phone', c.phone,
              'email', c.email,
              'created_at', c.created_at,
              'updated_at', c.updated_at
            ),
            'dts', COALESCE(jsonb_agg(jsonb_build_object(
              'sales_dt_id', dt.sales_dt_id,
              'sales_id', dt.sales_id,
              'prod_id', dt.prod_id,
              'prod_name', p.prod_name,
              'uom', p.uom,
              'qty', dt.qty,
              'unit_price', dt.unit_price,
              'stocProduct',jsonb_build_object(
                'prod_id', p.prod_id,
                'prod_name',p.prod_name,
                'qty',p.qty,
                'prod_type',p.prod_type,
                'price',p.price,
                'brand',p.brand
              )
              -- Add other dt columns as needed
            )), '[]'::jsonb),
            'mt', jsonb_build_object(
              'org_code', mt.org_code,
              'sales_id', mt.sales_id,
              'sales_date', mt.sales_date,
              'cust_id', mt.cust_id,
              'discount', mt.discount,
              'vat', mt.vat,
              'paid_amt', mt.paid_amt,
              'created_at', mt.created_at,
              'updated_at', mt.updated_at
            )
          ) AS result
        FROM
            sales_mt mt
        LEFT JOIN
            sales_dt dt ON mt.sales_id = dt.sales_id AND mt.org_code = dt.org_code
        LEFT JOIN
            customer c ON mt.cust_id = c.cust_id AND mt.org_code = c.org_code
        LEFT JOIN
            stock_vw p ON dt.prod_id = p.prod_id AND dt.org_code = p.org_code
        WHERE
            mt.sales_id = $1
            AND mt.org_code = $2
        GROUP BY
          mt.org_code, mt.sales_id, c.cust_id, c.cust_name, c.address, c.phone, c.email, c.created_at, c.updated_at;
      `, [sales_id, org_code]);
        // const mtData = await sql`SELECT * FROM sales_mt WHERE sales_id = ${sales_id} AND org_code = ${org_code}`
        // const dtsData = await sql`SELECT * FROM sales_dt WHERE sales_id = ${sales_id} AND org_code = ${org_code}`

        if (result.rows[0].result) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: result.rows[0].result // your can any data for responce
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