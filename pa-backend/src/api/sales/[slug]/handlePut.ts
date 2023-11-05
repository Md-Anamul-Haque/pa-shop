import { sql } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import validationSales_put from '@/validationChecks/validation.sales.put';

export const handlePurchasePUT = async (req: Request, res: Response) => {
    try {
        const { changeRows, deleteRows, mt: UpdateMtData, newRows } = validationSales_put(req)
        // let { changeRows, newRows, deleteRows, mt }: reqBodyDataType = req.body
        const org_code = req.auth?.user?.org_code as string;
        const sales_id = req.params.slug;
        const returnChange = req.query?.return_change ? req.query?.return_change == 'true' : true;

        // ... handle PUT logic start hear



        // handle db oparations
        const fainalData = await sql.begin(async sql => {
            const updateMt = UpdateMtData && await sql`update sales_mt set ${sql(UpdateMtData, 'sales_date', 'cust_id', 'discount', 'vat', 'paid_amt', 'updated_at')} 
            where sales_id = ${sales_id} and org_code= ${org_code}
            RETURNING *;
            `;

            let updateResult = changeRows && await sql`
                UPDATE sales_dt 
                SET 
                    prod_id = update_data.prod_id,
                    uom = update_data.uom,
                    qty = (update_data.qty)::int,
                    unit_price = (update_data.unit_price)::int,
                    updated_at=now()
                FROM 
                    (VALUES ${sql(changeRows)}) AS update_data (sales_dt_id, prod_id, uom, qty, unit_price)
                WHERE 
                    sales_dt.sales_dt_id = (update_data.sales_dt_id)::int 
                    and
                    sales_dt.org_code= ${org_code}
                RETURNING *;
            `;

            const newDtResult = newRows && await sql`INSERT INTO sales_dt${sql(newRows, 'org_code', 'sales_id', 'prod_id', 'uom', 'qty', 'unit_price')} returning *`;
            const deleteExisting = deleteRows && await sql`DELETE FROM sales_dt WHERE sales_dt_id IN(${deleteRows}) and org_code = ${org_code} returning *`;
            return { updateResult, updateMt, newDtResult, deleteExisting }
        });

        if (Object.keys(fainalData)) {
            const returnValue = {
                mt: fainalData?.updateMt?.[0],
                dts: [...fainalData?.updateResult || '', ...fainalData?.newDtResult || '']
            }
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: returnChange ? { ...returnValue } : {} // your can any data for responce
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_IMPLEMENTED',
                message: 'error message'  //your can any message'
            });
        }
    } catch (error) {
        console.log(error)
        return ResponseHandler(res, {
            resType: 'error',
            status: 'INTERNAL_SERVER_ERROR',
            message: (error as any)?.message || ''  //your can any message 
        });
    }
}