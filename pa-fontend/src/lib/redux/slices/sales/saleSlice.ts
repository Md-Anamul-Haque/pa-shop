/* Core */
import { createSlice } from '@reduxjs/toolkit';

/* Instruments */
import { customerType, salesDetailType, salesMasterType } from '@/types/tables.type';
import _ from 'lodash';
import { handleIgnoreStartZero } from '@/lib/utils';

const initialState: salesSliceState = {
    saleDts: [],
    saleMt: { paid_amt: '', cust_id: '', discount: '', vat: '' },
    customer: undefined,
    isLoading: false,
    // due: 0,
    _sum: 0

};

const get_sum = (state: salesSliceState) => {
    const newState = { ...state }
    if (newState.saleDts?.length) {
        const new_sum = ((_.sumBy(newState.saleDts, (sale) => Number(sale.qty) * Number(sale.unit_price)) + Number(newState.saleMt?.vat || 0)) - Number(newState.saleMt?.discount || 0)) || 0
        return new_sum;
    } else {
        return 0
    }
};

const nextIndex = (saleDts: salesDetailType[], idx: number, key: string, isnext: boolean): { rowNumber: number, key: string } => {
    let returnValue = {
        rowNumber: idx,
        key: ''
    };

    // Check if idx is out of bounds
    if (idx < 0 || idx >= saleDts.length) {
        if (idx >= saleDts.length) {
            returnValue = nextIndex(saleDts, idx - 2, key, false)
        }
        if (idx < 0 && saleDts.length > 1) {
            returnValue = nextIndex(saleDts, 1, key, true)
        }
        return returnValue;
    }

    // Check if prod_id is undefined or null
    if (!saleDts[idx]?.prod_id) {
        console.log({ isnext })
        // Avoid infinite loop by ensuring that the recursion doesn't go beyond array bounds
        if (isnext && idx + 1 < saleDts.length) {
            returnValue = nextIndex(saleDts, idx + 1, key, isnext);
        } else if (!isnext && idx > 0) {
            // when isNext ===false and index not valid
            returnValue = nextIndex(saleDts, idx - 1, key, isnext);
        }
    } else {
        returnValue = {
            key: key,
            rowNumber: idx
        };
    }
    return returnValue;
};

// function handleClearSales(state: salesSliceState) {
//     state.isLoading = false
//     state.saleDts = [];
//     state.saleMt = { paid_amt: 0, cust_id: '', };
//     state.customer = undefined;
//     state.isFocus = undefined;
//     console.log('clear')
//     console.log(state)
//     return state;
// }
export const salesSlice = createSlice({
    name: 'sells',
    initialState,
    reducers: {
        setCustomer(state, action: { payload: customerType }) {
            state.customer = action.payload;
        },
        pushSale(state, action: { payload: { saleDetail: salesDetailType } }) {
            state.saleDts?.push(action.payload.saleDetail);
            state._sum = get_sum({ ...state, saleDts: [...state.saleDts || [], action.payload.saleDetail] });
        },
        removeSale(state, action: { payload: number }) {
            // alert('removed is:' + action.payload)
            const newDts = state?.saleDts?.filter((_sal, i) => action.payload !== i);
            state.saleDts = newDts
            state._sum = get_sum({ ...state, saleDts: newDts });
        },
        setSaleDt(state, action: { payload: { IndexSale: number, editedSale?: salesDetailType } }) {
            const sales = state.saleDts || [];
            const editedSale = action.payload.editedSale;
            const IndexSale = action.payload.IndexSale;
            if (IndexSale < 0 || IndexSale >= sales.length) {
                console.error('Invalid index to edit.');
            }
            const newDts = sales.map((sale, i) =>
                i === IndexSale ? { ...sale, ...editedSale } : sale
            );
            state.saleDts = newDts
            state._sum = get_sum({ ...state, saleDts: newDts });
        },
        changeFocus(state, action: { payload: ('none' | { rowNumber: number; key: string; isNext: boolean }) }) {
            if (!state.saleDts?.length || state.saleDts?.length < 2) return;
            if (action.payload == 'none') {
                state.isFocus = undefined
            } else {
                const focus = nextIndex(state.saleDts, action.payload.rowNumber, action.payload.key, action.payload.isNext);
                state.isFocus = focus.key ? focus : undefined // action.payload
                console.log({ ...focus })
            }
        },
        handleSetVat(state, action: { payload: (string) }) {
            state.saleMt = { ...state.saleMt, vat: handleIgnoreStartZero(action.payload) }
            const new_sum = get_sum({ ...state, saleMt: { ...state.saleMt, vat: action.payload } });
            state._sum = new_sum
        },
        handleSetDiscount(state, action: { payload: (string) }) {
            state.saleMt = { ...state.saleMt, discount: handleIgnoreStartZero(action.payload) }
            const new_sum = get_sum({ ...state, saleMt: { ...state.saleMt, discount: action.payload } });
            state._sum = new_sum
        },
        handleSetPaid_amt(state, action: { payload: string }) {
            state.saleMt = { ...state.saleMt, paid_amt: handleIgnoreStartZero(action.payload) }
            // state.due = state._sum - Number(action.payload || 0)
        },
        handleSetSales_date(state, action: { payload: string | undefined }) {
            state.saleMt = { ...state.saleMt, sales_date: action.payload }
        },
        clearSales: (state) => {
            state = initialState
        }
    },
})

/* Types */
export interface salesSliceState {
    customer?: customerType;
    saleDts?: salesDetailType[];
    saleMt?: salesMasterType;
    isFocus?: { key: string; rowNumber: number }
    isLoading: boolean;
    error?: string;
    // due: number;
    _sum: number;
}