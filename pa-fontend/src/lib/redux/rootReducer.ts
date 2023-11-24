/* Instruments */
import { counterSlice, customerSlice, productSlice, purchaseSlice, supplierSlice, userSlice } from './slices'

export const reducer = {
    counter: counterSlice.reducer,
    user: userSlice.reducer,
    products: productSlice.reducer,
    suppliers: supplierSlice.reducer,
    customers: customerSlice.reducer,
    purchase: purchaseSlice.reducer,
}