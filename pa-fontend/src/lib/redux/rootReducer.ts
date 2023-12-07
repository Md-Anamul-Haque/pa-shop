/* Instruments */
import { counterSlice, customerSlice, productSlice, purchaseEditSlice, purchaseListSlice, purchaseSlice, salesSlice, supplierSlice, userSlice } from './slices';

export const reducer = {
    counter: counterSlice.reducer,
    user: userSlice.reducer,
    products: productSlice.reducer,
    suppliers: supplierSlice.reducer,
    customers: customerSlice.reducer,
    purchase: purchaseSlice.reducer,
    purchaseList: purchaseListSlice.reducer,
    purchaseEdit: purchaseEditSlice.reducer,
    sale: salesSlice.reducer
};