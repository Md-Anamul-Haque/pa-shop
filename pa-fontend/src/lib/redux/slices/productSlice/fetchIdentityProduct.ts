import ApiClient from "@/lib/ApiClient";
import { productType } from "@/types/tables.type";

const productApi = new ApiClient('/api/product');


export const fetchProducts = (searchProps?: { search?: string; skip?: number }) => {
    const search = searchProps?.search || '';
    const skip = searchProps?.skip || 0;
    return productApi.get<{ products: productType[] }>(`?search=${search}&skip=${skip}`);
};

export const updateProduct = (product: productType) => {
    return productApi.put(product.prod_id!, {
        data: product,
        withToast: true
    });

};


export const createProduct = (product: productType) => {
    return productApi.post('', {
        data: product,
        withToast: true
    });
};