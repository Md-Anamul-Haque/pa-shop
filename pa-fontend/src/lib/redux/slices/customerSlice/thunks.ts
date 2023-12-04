/* Instruments */
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk';
import { customerType } from '@/types/tables.type';
import { createCustomer, fetchCustomers, updateCustomer } from './fetchIdentityCustomer';

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const customerGetAsync = createAppAsyncThunk(
    'customer/fetchCustomers',
    async (searchProps?: { search?: string; skip?: number }) => {
        const response = await fetchCustomers(searchProps)
        // The value we return becomes the `fulfilled` action payload
        if (response.success) {
            return response.payload?.customer
        } else {
            throw new Error(response.message)
        }
    }
);

export const customerPutAsync = createAppAsyncThunk('customer/updateCustomer', async (customer: customerType) => {
    const response = await updateCustomer(customer)
    // The value we return becomes the `fulfilled` action payload
    if (response.success) {
        return response.payload
    } else {
        throw new Error(response.message)
    }
}
);


export const customerPostAsync = createAppAsyncThunk('customer/createCustomer', async (customer: customerType) => {
    const response = await createCustomer(customer)
    // The value we return becomes the `fulfilled` action payload
    if (response.success) {
        return response.payload
    } else {
        throw new Error(response.message)
    }
}
);
