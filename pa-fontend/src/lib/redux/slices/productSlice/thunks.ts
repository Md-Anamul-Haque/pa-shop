/* Instruments */
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk';
import { productType } from '@/types/tables.type';
import { userSlice } from '..';
import { createProduct, fetchProducts, updateProduct } from './fetchIdentityProduct';

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const productGetAsync = createAppAsyncThunk(
    'product/fetchProducts',
    async (searchProps: { search?: string; skip?: number } = {}, { dispatch }) => {
        const response = await fetchProducts(searchProps)
        // The value we return becomes the `fulfilled` action payload
        if (response.success) {
            return response.payload.products
        } else {
            if (response.isAuth == 'no') {
                dispatch(userSlice.actions.setIsAuth('no'))
            }
            throw new Error(response.message)
        }
    }
);

export const productPutAsync = createAppAsyncThunk('product/updateProduct', async (product: productType) => {
    const response = await updateProduct(product)
    // The value we return becomes the `fulfilled` action payload
    if (response.success) {
        return response.payload
    } else {
        throw new Error(response.message)
    }
}
);


export const productPostAsync = createAppAsyncThunk('product/createProduct', async (product: productType) => {
    const response = await createProduct(product)
    // The value we return becomes the `fulfilled` action payload
    if (response.success) {
        return response.payload
    } else {
        throw new Error(response.message)
    }
}
);
