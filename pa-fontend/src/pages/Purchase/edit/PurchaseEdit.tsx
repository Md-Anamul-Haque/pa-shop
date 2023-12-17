import PurchesEditHandler from "@/components/component/purchase-edit";
import { Card } from "@/components/ui/card";
import { purchaseEditSlice, selectPurchaseEdit, useDispatch, useSelector } from "@/lib/redux";
import { LoadEditableData } from "@/lib/redux/slices/purchaseEdit/thunks";
import { supplierType } from "@/types/tables.type";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

const PurchaseEdit = () => {
  const dispatch = useDispatch();
  let { pur_id } = useParams();
  const setSupplier = useCallback((supplier: supplierType) => {
    dispatch(purchaseEditSlice.actions.setSupplier(supplier));
  }, []);
  const {isFetchingData,isError,purchaseDts}=useSelector(selectPurchaseEdit)
  useEffect(() => {
    if(!pur_id){
      alert('pur_id is undefiend')
      return
    }
    dispatch(LoadEditableData(pur_id))
  }, [pur_id, setSupplier]);
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
      <PurchesEditHandler
        onSubmited={() => {
          dispatch(purchaseEditSlice.actions.clearPurchase());
          alert("ok submitted");
        }}
      />
      {JSON.stringify(purchaseDts)}
    </div>
  );
};

export default PurchaseEdit;
