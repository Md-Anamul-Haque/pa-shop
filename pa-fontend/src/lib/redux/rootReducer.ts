/* Instruments */
import { counterSlice, customerSlice, productSlice, purchaseEditSlice, purchaseListSlice, purchaseSlice, salesEditSlice, salesReturn_Slice, salesSlice, supplierSlice, userSlice } from './slices';
import { purchaseReturn_Slice } from './slices/purchaseReturn';

export const reducer = {
    counter: counterSlice.reducer,
    user: userSlice.reducer,
    products: productSlice.reducer,
    suppliers: supplierSlice.reducer,
    customers: customerSlice.reducer,
    purchase: purchaseSlice.reducer,
    purchaseList: purchaseListSlice.reducer,
    purchaseEdit: purchaseEditSlice.reducer,
    sale: salesSlice.reducer,
    saleEdit: salesEditSlice.reducer,
    purchaseReturn: purchaseReturn_Slice.reducer,
    salesReturn: salesReturn_Slice.reducer,
};