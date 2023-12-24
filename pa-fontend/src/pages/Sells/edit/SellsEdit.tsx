
import SalesEditHandler from "@/components/component/sales-edit";
import { Card } from "@/components/ui/card";
import { purchaseEditSlice, selectSalesEdit, useDispatch, useSelector } from "@/lib/redux";
import { LoadEditableData } from "@/lib/redux/slices/sales-editSlice/thunks";
import { supplierType } from "@/types/tables.type";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

const SaleEdit = () => {
    const dispatch = useDispatch();
    let { sales_id } = useParams();
    const setSupplier = useCallback((supplier: supplierType) => {
        dispatch(purchaseEditSlice.actions.setSupplier(supplier));
    }, []);
    const { isFetchingData, isError } = useSelector(selectSalesEdit)
    useEffect(() => {
        if (!sales_id) {
            alert('sales_id is undefiend')
            return
        }
        dispatch(LoadEditableData(sales_id))
    }, [sales_id, setSupplier]);
    if (isFetchingData) {
        return <div>Loading...</div>;
    } else if (isError) {
        return (
            <Card className="grid place-items-center h-screen w-full text-red-600 text-center">
                {isError}
            </Card>
        );
    }
    return (
        <div>
            <SalesEditHandler
                onSubmited={() => {
                    dispatch(purchaseEditSlice.actions.clearPurchase());
                    alert("ok submitted");
                }}
            />
        </div>
    );
};

export default SaleEdit;
