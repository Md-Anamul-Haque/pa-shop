/* Instruments */
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk';
import { createpurchase } from './fetchIdentityCount';

export const purchasePostAsync = createAppAsyncThunk('purchase/createPurchase', async (purchase: any) => {
    const response = await createpurchase(purchase)
    // The value we return becomes the `fulfilled` action payload
    if (response.success) {
        return response.payload
    } else {
        throw new Error(response.message)
    }
}
);
