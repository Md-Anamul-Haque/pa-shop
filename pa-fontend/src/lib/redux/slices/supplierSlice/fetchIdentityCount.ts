import ApiClient from "@/lib/ApiClient";
import { supplierType } from "@/types/tables.type";

const supplierApi = new ApiClient('/api/supplier');


export const fetchSuppliers = (searchProps?: { search?: string; skip?: number }) => {
    const search = searchProps?.search || '';
    const skip = searchProps?.skip || 0;
    return supplierApi.get<{ supplier: supplierType[] }>(`?search=${search}&skip=${skip}`);
};


export const updateSupplier = (supplier: supplierType) => {
    return supplierApi.put(supplier.supp_id!, {
        data: supplier,
        withToast: true
    });

};


export const createSupplier = (supplier: supplierType) => {
    return supplierApi.post('', {
        data: supplier,
        withToast: true
    });
};