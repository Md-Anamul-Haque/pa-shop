/* Core */
import { createSlice } from '@reduxjs/toolkit';

/* Instruments */
import { customerType } from '@/types/tables.type';
import { customerGetAsync, customerPostAsync, customerPutAsync } from './thunks';
const geteditIngCustomer = (data: customerType[]) => {
    let params = new URL(document.location.href).searchParams;
    let edit = params.get("edit"); // is the string "Jonathan Smith".
    const editCustomer = data.filter(d => d.cust_id === edit)
    return editCustomer?.[0] || undefined
}
const initialState: customerSliceState = {
    data: [],
    error: '',
    isLoading: false,
    new: {
        isLoading: false,
        open: false,
        error: ''
    },
    update: {
        isLoading: false,
        error: ''
    }

};

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setEdiable: (state, action) => {
            const { supp_id } = action.payload
            state.update.customer = state?.data?.filter(d => d.cust_id === supp_id)?.[0]
        },
        closeEdiable: (state) => {
            state.update.customer = undefined;
        },
        setnewOpen: (state, action) => {
            state.new.open = !!action.payload
        }
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(customerGetAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(customerGetAsync.fulfilled, (state, action: { payload: customerType[] }) => {
                state.isLoading = false
                state.data = action.payload;
                console.log({ p: action.payload })
                state.update.customer = geteditIngCustomer(action.payload)
            }).addCase(customerGetAsync.rejected, (state, action) => {
                state.error = action?.error?.message || 'error';
                state.isLoading = false;
            });
        builder
            .addCase(customerPutAsync.pending, (state) => {
                state.update.isLoading = true
            })
            .addCase(customerPutAsync.fulfilled, (state, action: { payload: customerType }) => {
                state.update.isLoading = false;
                console.log({ p: action.payload })
                state.data = [action.payload, ...state.data.filter(d => d.cust_id !== action.payload.cust_id)]
                console.log(state.data.filter(d => d.cust_id !== action.payload.cust_id))
                state.update.customer = undefined;
            }).addCase(customerPutAsync.rejected, (state, action) => {
                state.update.error = action?.error?.message || 'error';
                state.update.isLoading = false;
            });
        builder
            .addCase(customerPostAsync.pending, (state) => {
                state.new.isLoading = true
            })
            .addCase(customerPostAsync.fulfilled, (state, action: { payload: customerType }) => {
                state.new.isLoading = false;
                state.data = [action.payload, ...state.data];
                state.new.open = false
            }).addCase(customerPostAsync.rejected, (state, action) => {
                state.new.error = action?.error?.message || 'error';
                state.new.isLoading = false;
            });
    },
});

/* Types */
export interface customerSliceState {
    isLoading: boolean;
    error: string;
    data: customerType[];
    update: {
        isLoading: boolean;
        customer?: customerType;
        error?: string;
    };
    new: {
        open: boolean;
        isLoading: boolean;
        error?: string;
    };
}