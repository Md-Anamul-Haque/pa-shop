import { CustomerCard } from "@/components/component/customer/customer";
import { customerGetAsync, selectCustomers, useDispatch, useSelector } from "@/lib/redux";
import { useEffect } from "react";

import EditCustomer from "@/components/component/customer/EditCustomer";
import FilterCustomer from "@/components/component/customer/FilterCustomer";
import NewCustomer from "@/components/component/customer/NewCustomer";
import { Card } from "@/components/ui/card";

const Customers = () => {
    const dispatch = useDispatch();
    const { data: customers } = useSelector(selectCustomers);
    useEffect(() => {
        dispatch(customerGetAsync({}));
    }, [dispatch]);
    return (
        <main className="px-2">
            <Card className="flex p-1 max-w-3xl mx-auto rounded-none justify-between">
                <FilterCustomer />
                <NewCustomer />
            </Card>
            <div>

            </div >
            <div className="flex flex-wrap gap-3  mt-7">
                {customers && customers.map((customer) => {
                    return (
                        <CustomerCard customer={customer} key={customer.cust_id} />
                    )
                })}

            </div>
            <EditCustomer />
        </main>
    );
}

export default Customers
