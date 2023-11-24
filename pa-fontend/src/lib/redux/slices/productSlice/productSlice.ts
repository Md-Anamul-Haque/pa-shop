/* Core */
import { createSlice } from '@reduxjs/toolkit';

/* Instruments */
import { productType } from '@/types/tables.type';
import { productGetAsync, productPostAsync, productPutAsync } from './thunks';
const geteditIngProduct = (data: productType[]) => {
    let params = new URL(document.location.href).searchParams;
    let edit = params.get("edit"); // is the string "Jonathan Smith".
    const editProduct = data.filter(d => d.prod_id === edit)
    return editProduct?.[0] || undefined
}
const initialState: ProductSliceState = {
    data: [],
    error: '',
    isLoading: false,
    update: {
        isLoading: false
    },
    new: {
        isLoading: false,
        open: false
    }
};

export const productSlice = createSlice({
    name: 'product',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setEdiable: (state, action) => {
            const { prod_id } = action.payload
            state.update.product = state?.data?.filter(d => d.prod_id === prod_id)?.[0]
        },
        closeEdiable: (state) => {
            state.update.product = undefined;
        },
        setnewOpen: (state, action) => {
            state.new.open = !!action.payload;
        },
        // insertNewProduct: (state, action) => {
        //     state.data = [action.payload, ...state.data]
        // }
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(productGetAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(productGetAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                state.update.product = geteditIngProduct(state.data)
            }).addCase(productGetAsync.rejected, (state, action) => {
                state.error = action?.error?.message || 'error';
                state.isLoading = false;
            });
        builder
            .addCase(productPutAsync.pending, (state) => {
                state.update.isLoading = true
            })
            .addCase(productPutAsync.fulfilled, (state, action) => {
                state.update.isLoading = false;
                console.log({ p: action.payload })
                state.data = [action.payload, ...state.data.filter(d => d.prod_id !== action.payload.prod_id)]
                state.update.product = undefined;
            }).addCase(productPutAsync.rejected, (state, action) => {
                state.update.error = action?.error?.message || 'error';
                state.update.isLoading = false;
            });
        builder.addCase(productPostAsync.pending, (state) => {
            state.new.isLoading = true;
        }).addCase(productPostAsync.fulfilled, (state, action) => {
            state.new.isLoading = false;
            state.data = [action.payload, ...state.data];
        }).addCase(productPostAsync.rejected, (state, action) => {
            state.new.isLoading = false;
            state.new.error = action.error.message || 'error'
        });
    },
})

/* Types */
export interface ProductSliceState {
    isLoading: boolean;
    error: string;
    data: productType[];
    update: {
        isLoading: boolean;
        product?: productType;
        error?: string;
    };
    new: {
        open: boolean;
        isLoading: boolean;
        error?: string;
    };
}