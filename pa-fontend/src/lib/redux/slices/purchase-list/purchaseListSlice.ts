/* Core */
import { createSlice } from '@reduxjs/toolkit';

/* Instruments */
import { purchaseDetailType, purchaseMasterType } from '@/types/tables.type';

const initialState: purchaseListSliceState = {
    isLoading: false,
};


export const purchaseListSlice = createSlice({
    name: 'purchase_list',
    initialState,
    reducers: {
        pushPurchaseList(state, action: { payload: { mt: purchaseMasterType, dt: purchaseDetailType } }) {
            state.purchases = [...state.purchases || [], action.payload]
        },
        changePuchase(state, action: { payload: { mt: purchaseMasterType, dt: purchaseDetailType } }) {
            state.purchases = state.purchases?.map(pur => {
                if (pur.mt.pur_id === action.payload.mt.pur_id) {
                    return action.payload
                } else {
                    return pur
                }
            })
        },
    },
})


/* Types */
export interface purchaseListSliceState {
    purchases?: { mt: purchaseMasterType, dt: purchaseDetailType }[];
    isLoading: boolean;
    error?: string;
}