import ApiClient from "@/lib/ApiClient";
import { salesEditSliceState } from "@/lib/redux";
const purchaseApi = new ApiClient('/api/sales');

export const handleSaveEditSales = async ({ salesEditState, isLoading, setIsLoading, onSubmited }: { salesEditState: salesEditSliceState; isLoading: boolean, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, onSubmited: () => void }) => {
    const {
        saleDts = [],
        saleMt,
        customer,
        removed
    } = salesEditState;
    if (isLoading) return
    try {
        setIsLoading(true)
        const changeRows = saleDts?.filter(pdt => pdt.isThis == 'edited').map(dt => {
            return (
                {
                    sales_dt_id: dt.sales_dt_id,
                    prod_id: dt.prod_id,
                    qty: Number(dt.qty),
                    unit_price: Number(dt.unit_price)
                }
            )
        })
        const newRows = saleDts?.filter(pdt => pdt.isThis == 'new');
        const purData = {
            mt: {
                "cust_id": customer?.cust_id!,
                "discount": Number(saleMt?.discount) || 0,
                "vat": Number(saleMt?.vat) || 0,
                "paid_amt": Number(saleMt?.paid_amt) || 0,
                "sales_date": saleMt?.sales_date ? new Date(saleMt?.sales_date) : new Date()
            },
            changeRows,
            newRows,
            deleteRows: removed
        };
        const res = await purchaseApi.put(saleMt?.sales_id!, {
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
