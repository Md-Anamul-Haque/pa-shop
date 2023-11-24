/* Core */
import { createSlice } from '@reduxjs/toolkit';

/* Instruments */
import { supplierType } from '@/types/tables.type';
import { supplierGetAsync, supplierPostAsync, supplierPutAsync } from './thunks';
const geteditIngSupplier = (data: supplierType[]) => {
    let params = new URL(document.location.href).searchParams;
    let edit = params.get("edit"); // is the string "Jonathan Smith".
    const editSupplier = data.filter(d => d.supp_id === edit)
    return editSupplier?.[0] || undefined
}
const initialState: supplierSliceState = {
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

export const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setEdiable: (state, action) => {
            const { supp_id } = action.payload
            state.update.supplier = state?.data?.filter(d => d.supp_id === supp_id)?.[0]
        },
        closeEdiable: (state) => {
            state.update.supplier = undefined;
        },
        setnewOpen: (state, action) => {
            state.new.open = !!action.payload
        }
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(supplierGetAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(supplierGetAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                state.update.supplier = geteditIngSupplier(action.payload);
                state.error = ''
            }).addCase(supplierGetAsync.rejected, (state, action) => {
                state.error = action?.error?.message || 'error';
                state.isLoading = false;
            });
        builder
            .addCase(supplierPutAsync.pending, (state) => {
                state.update.isLoading = true
            })
            .addCase(supplierPutAsync.fulfilled, (state, action) => {
                state.update.isLoading = false;
                console.log({ p: action.payload })
                state.data = [action.payload, ...state.data.filter(d => d.supp_id !== action.payload.supp_id)]
                state.update.supplier = undefined;
                state.update.error = '';
            }).addCase(supplierPutAsync.rejected, (state, action) => {
                state.update.error = action?.error?.message || 'error';
                state.update.isLoading = false;
            });
        builder
            .addCase(supplierPostAsync.pending, (state) => {
                state.new.isLoading = true
            })
            .addCase(supplierPostAsync.fulfilled, (state, action) => {
                state.new.isLoading = false;
                state.data = [action.payload, ...state.data];
                state.new.open = false
                state.new.error = '';
            }).addCase(supplierPostAsync.rejected, (state, action) => {
                state.new.error = action?.error?.message || 'error';
                state.new.isLoading = false;
            });
    },
});

/* Types */
export interface supplierSliceState {
    isLoading: boolean;
    error: string;
    data: supplierType[];
    update: {
        isLoading: boolean;
        supplier?: supplierType;
        error?: string;
    };
    new: {
        open: boolean;
        isLoading: boolean;
        error?: string;
    };
}