import { sql } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import validationPurchaseReturn_put from '@/validationChecks/validation.Purchase_return.put';


export const handlePurchasePUT = async (req: Request, res: Response) => {
    try {
        const { mt: UpdateMtData, newRows, changeRows, deleteRows } = validationPurchaseReturn_put(req)
        const org_code = req.auth?.user?.org_code as string;
        const pur_r_id = req.params.slug
        const returnChange = req.query?.return_change ? req.query?.return_change == 'true' : true;
        // handle db oparations
        const fainalData = await sql.begin(async sql => {
            console.log({ UpdateMtData })
            const updateMt = UpdateMtData && await sql`
                                                        UPDATE purchase_return_mt set ${sql(UpdateMtData, 'pur_r_date', 'supp_id', 'discount', 'vat', 'paid_amt', 'remark', 'updated_at')} 
                                                        where pur_r_id = ${pur_r_id} and org_code= ${org_code}
                                                        RETURNING *;
                                                        `;
            if (!updateMt?.length) {
                throw new Error('updateMtData:' + 'not found')
            }
            console.log({ updateMt })

            let updateResult = changeRows && await sql`
                                                        UPDATE purchase_return_dt 
                                                        SET 
                                                            prod_id = update_data.prod_id,
                                                            uom = update_data.uom,
                                                            qty = (update_data.qty)::int,
                                                            unit_price = (update_data.unit_price)::int,
                                                            updated_at = now()
                                                        FROM 
                                                            (VALUES ${sql(changeRows)}) AS update_data (pur_r_dt_id, prod_id, uom, qty, unit_price)
                                                        WHERE 
                                                            purchase_return_dt.pur_r_dt_id = (update_data.pur_r_dt_id)::int 
                                                            AND purchase_return_dt.org_code = ${org_code}
                                                        RETURNING *;
                                                    `;


            const newDtResult = newRows && await sql`
                                                    INSERT INTO purchase_return_dt${sql(newRows, 'org_code', 'pur_r_id', 'prod_id', 'uom', 'qty', 'unit_price')} 
                                                    RETURNING *`;
            const deleteExisting = deleteRows && await sql`
                                                            DELETE FROM purchase_return_dt WHERE pur_r_dt_id IN(${deleteRows}) and org_code = ${org_code} 
                                                            RETURNING *`;
            return { updateResult, updateMt, newDtResult, deleteExisting }
        });
        console.log({ fainalData })
        if (fainalData.deleteExisting?.length || fainalData.newDtResult?.length || fainalData.updateMt?.length || fainalData.updateResult?.length) {
            const returnValue = {
                mt: fainalData?.updateMt?.[0],
                dts: [...fainalData?.updateResult || '', ...fainalData?.newDtResult || ''],
                deleted: fainalData?.deleteExisting || []
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
                message: 'No Changes'
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