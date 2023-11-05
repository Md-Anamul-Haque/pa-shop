import { sql } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import validationPurchase_put from '@/validationChecks/validation.Purchase.put';


export const handlePurchasePUT = async (req: Request, res: Response) => {
    try {
        const { mt: UpdateMtData, newRows, changeRows, deleteRows } = validationPurchase_put(req)
        const org_code = req.auth?.user?.org_code as string;
        const pur_id = req.params.slug
        const returnChange = req.query?.return_change ? req.query?.return_change == 'true' : true;
        // handle db oparations
        const fainalData = await sql.begin(async sql => {
            console.log({ UpdateMtData })
            const updateMt = UpdateMtData && await sql`update purchase_mt set ${sql(UpdateMtData, 'pur_date', 'supp_id', 'discount', 'vat', 'paid_amt', 'updated_at')} 
            where pur_id = ${pur_id} and org_code= ${org_code}
            RETURNING *;
            `;
            console.log({ updateMt })
            let updateResult = changeRows && await sql`
                UPDATE purchase_dt 
                SET 
                    prod_id = update_data.prod_id,
                    uom = update_data.uom,
                    qty = (update_data.qty)::int,
                    unit_price = (update_data.unit_price)::int,
                    updated_at=now()
                FROM 
                    (VALUES ${sql(changeRows)}) AS update_data (pur_dt_id, prod_id, uom, qty, unit_price)
                WHERE 
                    purchase_dt.pur_dt_id = (update_data.pur_dt_id)::int 
                    and
                    purchase_dt.org_code= ${org_code}
                RETURNING *;
            `;

            const newDtResult = newRows && await sql`INSERT INTO purchase_dt${sql(newRows, 'org_code', 'pur_id', 'prod_id', 'uom', 'qty', 'unit_price')} returning *`;
            const deleteExisting = deleteRows && await sql`DELETE FROM purchase_dt WHERE pur_dt_id IN(${deleteRows}) and org_code = ${org_code} returning *`;
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
                message: 'error message'  //your can anfainalData.updateMty message'
            });
        }
    } catch (error) {
        console.log((error as any)?.message)
        return ResponseHandler(res, {
            resType: 'error',
            status: 'INTERNAL_SERVER_ERROR',
            message: (error as any)?.message || ''  //your can any message 
        });
    }
}