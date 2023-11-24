/* Core */
import { createSlice } from '@reduxjs/toolkit';

/* Instruments */
import { purchaseDetailType, purchaseMasterType, supplierType } from '@/types/tables.type';

const initialState: purchaseSliceState = {
    purchaseDts: [],
    purchaseMt: { paid_amt: 0, supp_id: '', },
    supplier: undefined
};

export const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        setSupplier(state, action: { payload: supplierType }) {
            state.supplier = action.payload;
        },
        pushPurchase(state, action: { payload: { purchaseDetail: purchaseDetailType } }) {
            state.purchaseDts?.push(action.payload.purchaseDetail);
        },
        removePurchase(state, action: { payload: { pur_id: string; } }) {
            state.purchaseDts = state?.purchaseDts?.filter((pur) => pur.pur_id !== action.payload.pur_id);
        },
        setPurchaseDt(state, action: { payload: { IndexPur: number, editedPur?: purchaseDetailType } }) {
            const purs = state.purchaseDts || [];
            const editedPur = action.payload.editedPur;
            const IndexPur = action.payload.IndexPur;
            if (IndexPur < 0 || IndexPur >= purs.length) {
                console.error('Invalid index to edit.');
            }
            state.purchaseDts = purs.map((pur, i) =>
                i === IndexPur ? { ...pur, ...editedPur } : pur
            );

        }
    },
})

/* Types */
export interface purchaseSliceState {
    supplier?: supplierType;
    purchaseDts?: purchaseDetailType[];
    purchaseMt?: purchaseMasterType;

}