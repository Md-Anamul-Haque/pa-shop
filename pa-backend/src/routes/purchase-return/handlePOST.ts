import { pool, sql } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { purchaseReturnDetailType, purchaseReturnMasterType } from '@/types/tables.type';
import Joi from 'joi';

type reqBodyDataType = {
    mt: purchaseReturnMasterType;
    dts: purchaseReturnDetailType[];
}
const newRowSchema = Joi.object({
    org_code: Joi.string(),
    pur_r_id: Joi.string().required(),
    prod_id: Joi.string().required(),
    // uom: Joi.string().required(),
    qty: Joi.number().required(),
    unit_price: Joi.number().required(),
});

const schema = {
    newMtData: Joi.object({
        org_code: Joi.string().required(),
        pur_r_id: Joi.string().required(),
        pur_r_date: Joi.alternatives().try(Joi.date(), Joi.string()).required(),
        supp_id: Joi.string().required(),
        discount: Joi.number(),
        vat: Joi.number(),
        paid_amt: Joi.number(),
        remark: Joi.string()
    }),
    newPurchaseDtValues: Joi.array().items(newRowSchema)
};

export const handlePurchasePOST = async (req: Request, res: Response) => {
    try {
        const org_code = req.auth?.user?.org_code as string;

        const { mt, dts }: reqBodyDataType = req.body;
        const { rows: [{ pur_r_id }] } = await pool.query(`SELECT 
              CASE 
                WHEN COUNT(*) = 0 OR MAX(CASE WHEN org_code = '${org_code}' THEN 1 ELSE 0 END) = 0 
                THEN 'PUR_R_1'
                ELSE 'PUR_R_' || (COALESCE(
                  MAX(CAST(SPLIT_PART(pur_r_id, '_', 2) AS INTEGER)), 0) + 1)::TEXT
              END
              as pur_r_id
            FROM 
            purchase_return_mt`);
        const newMtData = {
            org_code,
            pur_r_id,
            pur_r_date: mt?.pur_r_date || new Date(),
            supp_id: mt.supp_id,
            discount: Number(mt.discount),
            vat: Number(mt.vat),
            paid_amt: Number(mt.paid_amt),
            remark: mt.remark
        };
        console.log('pass mt')
        const { error: validationError_mt } = schema.newMtData.validate(newMtData);
        if (validationError_mt) {
            throw new Error('newMtData:' + validationError_mt.details[0].message)
        }

        console.log({ newMtData })
        const [purchaseMtResult, purchaseDtResult] = await sql.begin(async sql => {
            const [purchaseMtResult] = await sql`insert into purchase_return_mt ${sql(newMtData, 'pur_r_id', 'org_code', 'pur_r_date', 'supp_id', 'discount', 'vat', 'paid_amt')} returning *`;
            const newPurchaseDtValues = dts.map((dt: purchaseReturnDetailType) => (
                {
                    org_code,
                    pur_r_id: purchaseMtResult.pur_r_id,
                    prod_id: dt.prod_id,
                    // uom: dt.uom,
                    qty: Number(dt.qty),
                    unit_price: Number(dt.unit_price),
                }
            ));
            const { error: validationError_dt } = schema.newPurchaseDtValues.validate(newPurchaseDtValues);
            if (validationError_dt) {
                throw new Error('newdt:' + validationError_dt.details[0].message)
            }
            const purchaseDtResult = await sql`INSERT INTO purchase_return_dt ${sql(newPurchaseDtValues, 'org_code', 'pur_r_id', 'prod_id', 'qty', 'unit_price')} returning *`;
            return [purchaseMtResult, purchaseDtResult]
        });
        if (purchaseMtResult) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                message: '',
                payload: { purchaseMtResult, purchaseDtResult }// your can any data for responce
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_IMPLEMENTED',
                message: 'error message'  //your can any message'
            });
        }
    } catch (error) {
        console.log('ROLLBACK')
        return ResponseHandler(res, {
            resType: 'error',
            status: 'INTERNAL_SERVER_ERROR',
            message: (error as any)?.message
        });
    }
}
