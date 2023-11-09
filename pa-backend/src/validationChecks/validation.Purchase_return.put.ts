import { Request } from "@/types/request&responce.type";
import { purchaseReturnDetailType, purchaseReturnMasterType } from "@/types/tables.type";


type reqBodyDataType = {
    newRows?: purchaseReturnDetailType[];
    deleteRows?: number[];
    changeRows?: purchaseReturnDetailType[];
    mt?: purchaseReturnMasterType;
}

import Joi from 'joi';
// const innerArraySchema = Joi.alternatives().try(Joi.string(), Joi.number());
// const arrayOfArraysSchema = Joi.array().items(Joi.array().items(innerArraySchema));
const newRowSchema = Joi.object({
    org_code: Joi.string(),
    pur_id: Joi.string().required(),
    prod_id: Joi.string().required(),
    uom: Joi.string().required(),
    qty: Joi.number().required(),
    unit_price: Joi.number().required(),
});

const changeRowSchema = Joi.object({
    pur_dt_id: Joi.number().required(),
    prod_id: Joi.string().required(),
    uom: Joi.string().required(),
    qty: Joi.number().required(),
    unit_price: Joi.number().required()
});
const schema = {
    mt: Joi.object({
        pur_date: Joi.alternatives().try(Joi.date(), Joi.string()).required(),
        supp_id: Joi.string().required(),
        discount: Joi.number(),
        vat: Joi.number(),
        paid_amt: Joi.number(),
    }),
    newRows: Joi.array().items(newRowSchema),
    changeRows: Joi.array().items(changeRowSchema),
    deleteRows: Joi.array().items(Joi.number())
};


const validationPurchaseReturn_put = (req: Request) => {
    let { changeRows, newRows, deleteRows, mt }: reqBodyDataType = req.body;
    console.log({ changeRows })
    const org_code = req.auth?.user?.org_code as string;
    const pur_r_id = req.params.slug
    newRows = newRows?.map(dt => ({ ...dt, pur_r_id, org_code }))
    // ... handle PUT logic start hear
    const updateRowsData = changeRows?.map(dt => [
        Number(dt.pur_r_dt_id),
        dt.prod_id,
        dt.uom,
        Number(dt.qty),
        Number(dt.unit_price)
    ]);

    const UpdateMtData = mt ? {
        pur_date: mt?.pur_date,
        supp_id: mt.supp_id,
        discount: Number(mt.discount),
        vat: Number(mt.vat),
        paid_amt: Number(mt.paid_amt),
        remark: mt.remark,
        updated_at: new Date()
    } : undefined;

    const newPurchaseDtValues = newRows?.map((dt: purchaseReturnDetailType) => (
        {
            org_code,
            pur_r_id,
            prod_id: dt.prod_id,
            uom: dt.uom,
            qty: Number(dt.qty),
            unit_price: Number(dt.unit_price),
        }
    ));

    if (mt) {
        console.log('pass mt')
        const { error: validationError } = schema.mt.validate(mt);
        if (validationError) {
            throw new Error('mt:' + validationError.details[0].message)
        }
    }
    if (newRows) {
        console.log('pass newRows')
        const { error: validationError } = schema.newRows.validate(newRows);
        if (validationError) {
            throw new Error('newRows:' + validationError.details[0].message)
        }
    }
    if (deleteRows) {
        console.log('pass deleteRows')
        const { error: validationError } = schema.deleteRows.validate(deleteRows);
        if (validationError) {
            throw new Error('deleteRows:' + validationError.details[0].message)
        }
    }
    if (changeRows) {
        console.log('pass changeRows')
        const { error: validationError } = schema.changeRows.validate(changeRows);
        if (validationError) {
            throw new Error('changeRows:' + validationError.details[0].message)
        }
    }
    return ({ newRows: newPurchaseDtValues, changeRows: updateRowsData, mt: UpdateMtData, deleteRows })

}

export default validationPurchaseReturn_put
