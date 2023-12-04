import ApiClient from "@/lib/ApiClient";
import { customerType, salesDetailType, salesMasterType } from "@/types/tables.type";
const purchaseApi = new ApiClient('/api/purchase');

export const handleSubmitSales = async ({ customer, saleMt, saleDts, isLoading, setIsLoading, onSubmited }: { customer: customerType, saleMt: salesMasterType, saleDts: salesDetailType[], isLoading: boolean, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, onSubmited: () => void }) => {
    if (isLoading) return
    try {
        setIsLoading(true)
        const purData = {
            mt: {
                "cust_id": customer?.cust_id!,
                "discount": saleMt?.discount,
                "vat": saleMt?.vat,
                "paid_amt": saleMt?.paid_amt,
                "sales_date": saleMt?.sales_date ? new Date(saleMt?.sales_date) : new Date()

            },
            dts: saleDts?.map(sdt => {
                return ({
                    "prod_id": sdt.prod_id,
                    // "uom": sdt.uom,
                    "qty": sdt.qty,
                    "unit_price": sdt.unit_price
                })
            })
        };
        const res = await purchaseApi.post('', {
            withToast: true,
            data: purData,
            toastMessages: {
                success: 'success to purchase'
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