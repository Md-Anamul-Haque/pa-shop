/* Instruments */
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk';
import { supplierType } from '@/types/tables.type';
import { userSlice } from '..';
import { createSupplier, fetchSuppliers, updateSupplier } from './fetchIdentityCount';

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const supplierGetAsync = createAppAsyncThunk('supplier/fetchSuppliers', async (searchProps: { search?: string; skip?: number } = {}, { dispatch }) => {
    const response = await fetchSuppliers(searchProps)
    // The value we return becomes the `fulfilled` action payload
    if (response.success) {
        return response.payload?.supplier
    } else if (response.isAuth == 'no') {
        dispatch(userSlice.actions.setIsAuth('no'));
        throw new Error(response.message)
    } else {
        throw new Error(response.message)
    }
}
);
export const supplierPutAsync = createAppAsyncThunk('supplier/updateSupplier', async (supplier: supplierType, { dispatch }) => {
    const response = await updateSupplier(supplier)
    // The value we return becomes the `fulfilled` action payload
    if (response.success) {
        return response.payload
    } else if (response.isAuth == 'no') {
        dispatch(userSlice.actions.setIsAuth('no'));
    } else {
        throw new Error(response.message)
    }
}
);


export const supplierPostAsync = createAppAsyncThunk('supplier/createSupplier', async (supplier: supplierType, { dispatch }) => {
    const response = await createSupplier(supplier)
    // The value we return becomes the `fulfilled` action payload
    if (response.success) {
        return response.payload
    } else if (response.isAuth == 'no') {
        dispatch(userSlice.actions.setIsAuth('no'));
    } else {
        throw new Error(response.message)
    }
}
);
