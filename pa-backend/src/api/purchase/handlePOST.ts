import { client } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { purchaseDetailType, purchaseMasterType } from '@/types/tables.type';

type reqBodyDataType = {
    mt: purchaseMasterType;
    dts: purchaseDetailType[];
}


export const handlePurchasePOST = async (req: Request, res: Response) => {
    await client.connect();
    await client.query('BEGIN');
    try {
        const org_code = req.auth?.user?.org_code;

        const { mt, dts }: reqBodyDataType = req.body;
        const pur_date = mt.pur_date;
        const { rows: purchaseMtResult } = await client.query(
            `INSERT INTO purchase_mt (
                org_code, 
                pur_date,
                supp_id, 
                total_amt, 
                discount, 
                vat, 
                paid_amt
                ) VALUES ($1,$2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                org_code,
                pur_date,
                mt.supp_id,
                mt.total_amt,
                Number(mt.discount),
                Number(mt.vat),
                Number(mt.paid_amt),
            ]
        );
        console.log('first')
        console.log({ purchaseMtResult })
        // Insert into purchase_dt
        type pdt = purchaseDetailType & { tmp_id?: string };
        const purchaseDtValues = dts.map((dt: pdt) => (
            {
                org_code,
                tmp_id: dt.tmp_id,
                pur_id: purchaseMtResult[0].pur_id,
                pur_date: purchaseMtResult[0].pur_date,
                prod_id: dt.prod_id,
                uom: Number(dt.uom),
                qty: Number(dt.qty),
                unit_price: Number(dt.unit_price),
            }
        ));
        console.log(purchaseDtValues)
        for (const purchaseDtValue of purchaseDtValues) {
            await client.query(
                `INSERT INTO purchase_dt(org_code, pur_id, pur_date, prod_id, uom, qty, unit_price) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [purchaseDtValue.org_code, purchaseDtValue.pur_id, purchaseDtValue.pur_date, purchaseDtValue.prod_id, purchaseDtValue.uom, purchaseDtValue.qty, purchaseDtValue.unit_price],
            );
        }
        console.log('inserted dt successfully')        // await client.query('INSERT INTO purchase_dt(org_code, pur_id, pur_date, prod_id, uom, qty, unit_price, created_at, updated_at) VALUES %1', ["('org_1', '20', '2023-11-01', 'PROD_1', 'pcs', '5', '200'), ('org_1', '20', '2023-11-01', 'PROD_2', 'pcs', '10', '80')"]);



        // Commit the transaction
        await client.query('COMMIT');
        await client.end();
        return ResponseHandler(res, {
            resType: 'success',
            status: 'OK',
            message: '',
            // payload:''// your can any data for responce
        });

    } catch (error) {
        await client.query('ROLLBACK');
        await client.end();
        console.log('ROLLBACK')
        return ResponseHandler(res, {
            resType: 'error',
            status: 'INTERNAL_SERVER_ERROR',
            message: (error as any)?.message
        });
    }
}