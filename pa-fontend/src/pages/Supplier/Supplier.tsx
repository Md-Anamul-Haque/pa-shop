import EditSupplier from "@/components/component/supplier/EditSupplier";
import FilterSupplier from "@/components/component/supplier/FilterSupplier";
import NewSupplier from "@/components/component/supplier/NewSupplier";
import { SupplierCard } from "@/components/component/supplier/Supplier";
import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "@/lib/redux";
import { selectSuppliers, supplierGetAsync } from "@/lib/redux/slices/supplierSlice";
import { useEffect } from "react";

const Suppliers = () => {
    const dispatch = useDispatch();
    const { data: suppliers } = useSelector(selectSuppliers);
    useEffect(() => {
        dispatch(supplierGetAsync({}));
    }, [dispatch]);
    return (
        <main className="px-2">
            <Card className="flex p-1 max-w-3xl mx-auto rounded-none justify-between">
                <FilterSupplier />
                <NewSupplier />
            </Card>
            <div>

            </div >
            <div className="flex flex-wrap gap-3  mt-7">
                {suppliers && suppliers.map((supplier) => {
                    return (
                        <SupplierCard supplier={supplier} key={supplier.supp_id} />
                    )
                })}

            </div>
            <EditSupplier />
        </main>
    );
};

export default Suppliers