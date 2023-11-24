import ApiClient from "@/lib/ApiClient";
import { customerType } from "@/types/tables.type";

const customerApi = new ApiClient('/api/customer');


export const fetchCustomers = (searchProps?: { search?: string; skip?: number }) => {
    const search = searchProps?.search || '';
    const skip = searchProps?.skip || 0;
    return customerApi.get<customerType[]>(`?search=${search}&skip=${skip}`);
};


export const updateCustomer = (customer: customerType) => {
    if (!customer.cust_id) { throw new Error('customer id is required') }
    return customerApi.put(customer.cust_id!, {
        data: customer,
        withToast: true
    });

};


export const createCustomer = (customer: customerType) => {
    return customerApi.post('', {
        data: customer,
        withToast: true
    });
};