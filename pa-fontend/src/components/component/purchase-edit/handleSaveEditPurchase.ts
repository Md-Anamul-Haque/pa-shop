import ApiClient from "@/lib/ApiClient";
import { purchaseEditSliceState, selectPurchaseEdit, useSelector } from "@/lib/redux";
import { purchaseEditDetailType } from "@/types/purchaseEditDetailType";
import { purchaseDetailType, purchaseMasterType, supplierType } from "@/types/tables.type";
const purchaseApi = new ApiClient('/api/purchase');
type reqBodyDataType = {
    newRows?: purchaseDetailType[];
    deleteRows?: number[];
    changeRows?: purchaseDetailType[];
    mt?: purchaseMasterType;
}
export const handleSaveEditPurchase = async ({ purchaseEditState, isLoading, setIsLoading, onSubmited }: { purchaseEditState: purchaseEditSliceState; isLoading: boolean, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, onSubmited: () => void }) => {
    // e.preventDefault()
    const {
        purchaseDts = [],
        purchaseMt,
        supplier,
        removed
    } = purchaseEditState;
    if (isLoading) return
    try {
        setIsLoading(true)
        const changeRows = purchaseDts?.filter(pdt => pdt.isThis == 'edited').map(dt => {
            return (
                {
                    pur_dt_id: dt.pur_dt_id,
                    prod_id: dt.prod_id,
                    qty: Number(dt.qty),
                    unit_price: Number(dt.unit_price)
                }
            )
        })
        const newRows = purchaseDts?.filter(pdt => pdt.isThis == 'new');
        const purData = {
            mt: {
                "supp_id": supplier?.supp_id!,
                "discount": Number(purchaseMt?.discount) || 0,
                "vat": Number(purchaseMt?.vat) || 0,
                "paid_amt": Number(purchaseMt?.paid_amt) || 0,
                "pur_date": purchaseMt?.pur_date ? new Date(purchaseMt?.pur_date) : new Date()
            },
            changeRows,
            newRows,
            deleteRows: removed
        };
        const res = await purchaseApi.put(purchaseMt?.pur_id!, {
            withToast: true,
            data: purData,
            toastMessages: {
                success: 'successfully edit'
            }
        })


        setTimeout(() => {
            if (res.success) {
                onSubmited()
            }
            setIsLoading(false)
        }, 1000);
    } catch (error) {
        setIsLoading(false)
    }

}