import ApiClient from "@/lib/ApiClient";
import { productType } from "@/types/tables.type";

const productApi = new ApiClient('/api/purchase');


export const createpurchase = (purchase: productType) => {
    return productApi.post('', {
        data: purchase,
        withToast: true
    });
};