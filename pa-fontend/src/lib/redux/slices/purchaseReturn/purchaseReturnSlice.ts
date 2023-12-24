/* Core */
import { createSlice } from '@reduxjs/toolkit';

/* Instruments */
import { purchaseReturnMasterType, purchaseReturnDetailType, supplierType } from '@/types/tables.type';
import _ from 'lodash';
import { handleIgnoreStartZero } from '@/lib/utils';

const initialState: PurchaseReturnState = {
    purchaseDts: [],
    purchaseMt: { paid_amt: '', supp_id: '', discount: '', vat: '' },
    supplier: undefined,
    isLoading: false,
    // due: 0,
    _sum: 0

};

const get_sum = (state: PurchaseReturnState) => {
    const newState = { ...state }
    if (newState.purchaseDts?.length) {
        const new_sum = ((_.sumBy(newState.purchaseDts, (pur) => Number(pur.qty) * Number(pur.unit_price)) + Number(newState.purchaseMt?.vat || 0)) - Number(newState.purchaseMt?.discount || 0)) || 0
        return new_sum;
    } else {
        return 0
    }
};

const nextIndex = (purchaseDts: purchaseReturnDetailType[], idx: number, key: string, isnext: boolean): { rowNumber: number, key: string } => {
    let returnValue = {
        rowNumber: idx,
        key: ''
    };

    // Check if idx is out of bounds
    if (idx < 0 || idx >= purchaseDts.length) {
        if (idx >= purchaseDts.length) {
            returnValue = nextIndex(purchaseDts, idx - 2, key, false)
        }
        if (idx < 0 && purchaseDts.length > 1) {
            returnValue = nextIndex(purchaseDts, 1, key, true)
        }
        return returnValue;
    }

    // Check if prod_id is undefined or null
    if (!purchaseDts[idx]?.prod_id) {
        console.log({ isnext })
        // Avoid infinite loop by ensuring that the recursion doesn't go beyond array bounds
        if (isnext && idx + 1 < purchaseDts.length) {
            returnValue = nextIndex(purchaseDts, idx + 1, key, isnext);
        } else if (!isnext && idx > 0) {
            // when isNext ===false and index not valid
            returnValue = nextIndex(purchaseDts, idx - 1, key, isnext);
        }
    } else {
        returnValue = {
            key: key,
            rowNumber: idx
        };
    }
    return returnValue;
};

export const purchaseReturn_Slice = createSlice({
    name: 'purchase_return',
    initialState,
    reducers: {
        setSupplier(state, action: { payload: supplierType }) {
            state.supplier = action.payload;
        },
        pushPurchase(state, action: { payload: { purchaseDetail: purchaseReturnDetailType } }) {
            state.purchaseDts?.push(action.payload.purchaseDetail);
            state._sum = get_sum({ ...state, purchaseDts: [...state.purchaseDts || [], action.payload.purchaseDetail] });
        },
        removePurchase(state, action: { payload: number }) {
            // alert('removed is:' + action.payload)
            const newDts = state?.purchaseDts?.filter((_sal, i) => action.payload !== i);
            state.purchaseDts = newDts
            state._sum = get_sum({ ...state, purchaseDts: newDts });
        },
        setPurchaseDt(state, action: { payload: { IndexPurchase: number, editedPurchase?: purchaseReturnDetailType } }) {
            const purs = state.purchaseDts || [];
            const editedPurchase = action.payload.editedPurchase;
            const IndexPurchase = action.payload.IndexPurchase;
            if (IndexPurchase < 0 || IndexPurchase >= purs.length) {
                console.error('Invalid index to edit.');
            }
            const newDts = purs.map((pur, i) =>
                i === IndexPurchase ? { ...pur, ...editedPurchase } : pur
            );
            state.purchaseDts = newDts
            state._sum = get_sum({ ...state, purchaseDts: newDts });
        },
        changeFocus(state, action: { payload: ('none' | { rowNumber: number; key: string; isNext: boolean }) }) {
            if (!state.purchaseDts?.length || state.purchaseDts?.length < 2) return;
            if (action.payload == 'none') {
                state.isFocus = undefined
            } else {
                const focus = nextIndex(state.purchaseDts, action.payload.rowNumber, action.payload.key, action.payload.isNext);
                state.isFocus = focus.key ? focus : undefined // action.payload
                console.log({ ...focus })
            }
        },
        handleSetVat(state, action: { payload: (string) }) {
            state.purchaseMt = { ...state.purchaseMt, vat: handleIgnoreStartZero(action.payload) }
            const new_sum = get_sum({ ...state, purchaseMt: { ...state.purchaseMt, vat: action.payload } });
            state._sum = new_sum
        },
        handleSetDiscount(state, action: { payload: (string) }) {
            state.purchaseMt = { ...state.purchaseMt, discount: handleIgnoreStartZero(action.payload) }
            const new_sum = get_sum({ ...state, purchaseMt: { ...state.purchaseMt, discount: action.payload } });
            state._sum = new_sum
        },
        handleSetPaid_amt(state, action: { payload: string }) {
            state.purchaseMt = { ...state.purchaseMt, paid_amt: handleIgnoreStartZero(action.payload) }
            // state.due = state._sum - Number(action.payload || 0)
        },
        handleSetPur_r_date(state, action: { payload: string | undefined }) {
            state.purchaseMt = { ...state.purchaseMt, pur_r_date: action.payload }
        },
        clearPurs(state) {
            state = initialState
        }
    },
})

/* Types */
export interface PurchaseReturnState {
    supplier?: supplierType;
    purchaseDts?: purchaseReturnDetailType[];
    purchaseMt?: purchaseReturnMasterType;
    isFocus?: { key: string; rowNumber: number }
    isLoading: boolean;
    error?: string;
    // due: number;
    _sum: number;
}
