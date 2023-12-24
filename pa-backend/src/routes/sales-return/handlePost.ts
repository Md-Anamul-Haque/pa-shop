import { pool, sql } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { salesReturnDetailType, salesReturnMasterType } from '@/types/tables.type';
import Joi from 'joi';

type reqBodyDataType = {
    mt: salesReturnMasterType;
    dts: salesReturnDetailType[];
}

const newRowSchema = Joi.object({
    org_code: Joi.string(),
    sales_r_id: Joi.string().required(),
    prod_id: Joi.string().required(),
    // uom: Joi.string().required(),
    qty: Joi.number().required(),
    unit_price: Joi.number().required(),
    // remark: Joi.string()
});

const schema = {
    newMtData: Joi.object({
        org_code: Joi.string().required(),
        sales_r_id: Joi.string().required(),
        sales_r_date: Joi.alternatives().try(Joi.date(), Joi.string()).required(),
        cust_id: Joi.string().required(),
        discount: Joi.number(),
        vat: Joi.number(),
        paid_amt: Joi.number(),
        remark: Joi.string().allow('')
    }),
    newSalesDtValues: Joi.array().items(newRowSchema)
};

export const handleSalesPOST = async (req: Request, res: Response) => {
    try {
        // ... handle POST logic start hear
        const org_code = req.auth?.user?.org_code as string;
        const { mt, dts }: reqBodyDataType = req.body;
        console.log(org_code)
        const sales_r_date = mt?.sales_r_date || new Date();

        const { rows: [{ sales_r_id }] } = await pool.query(`
            SELECT 
              CASE 
                WHEN COUNT(*) = 0 OR MAX(CASE WHEN org_code = '${org_code}' THEN 1 ELSE 0 END) = 0 
                THEN 'SAL_R_1'
                ELSE 'SAL_R_' || (COALESCE(
                  MAX(CAST(SPLIT_PART(sales_r_id, '_', 2) AS INTEGER)), 0) + 1)::TEXT
              END
              as sales_r_id
            FROM 
            sales_return_mt`);
        console.log({ sales_r_id })
        const newMtData = {
            org_code,
            sales_r_id,
            sales_r_date,
            cust_id: mt.cust_id,
            discount: Number(mt.discount),
            vat: Number(mt.vat),
            paid_amt: Number(mt.paid_amt),
            remark: mt.remark || ''
        };
        const { error: validationError_mt } = schema.newMtData.validate(newMtData);
        if (validationError_mt) {
            throw new Error('newMtData:' + validationError_mt.details[0].message)
        }

        const [salesMtResult, salesDtResult] = await sql.begin(async sql => {
            const [salesMtResult] = await sql`insert into sales_return_mt ${sql(newMtData, 'sales_r_id', 'org_code', 'sales_r_date', 'cust_id', 'discount', 'vat', 'paid_amt', 'remark')} returning *`;
            const newSalesDtValues = dts.map((dt: salesReturnDetailType) => (
                {
                    org_code,
                    sales_r_id: salesMtResult.sales_r_id,
                    prod_id: dt.prod_id,
                    // uom: dt.uom,
                    qty: Number(dt.qty),
                    unit_price: Number(dt.unit_price),
                }
            ));
            const { error: validationError_dt } = schema.newSalesDtValues.validate(newSalesDtValues);
            if (validationError_dt) {
                throw new Error('newdt:' + validationError_dt.details[0].message)
            }
            const salesDtResult = await sql`INSERT INTO sales_return_dt${sql(newSalesDtValues, 'org_code', 'sales_r_id', 'prod_id', 'qty', 'unit_price')} returning *`;

            return ([salesMtResult, salesDtResult])
        })

        if (salesMtResult) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: { salesMtResult, salesDtResult } // your can any data for responce
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_IMPLEMENTED',
                message: 'error message'  //your can any message'
            });
        }
    } catch (error) {
        console.error(error)
        return ResponseHandler(res, {
            resType: 'error',
            status: 'INTERNAL_SERVER_ERROR',
            message: (error as any)?.message || ''  //your can any message 
        });
    }
}