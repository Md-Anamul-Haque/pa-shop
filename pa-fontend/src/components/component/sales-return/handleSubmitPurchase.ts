import ApiClient from "@/lib/ApiClient";
import { customerType, salesReturnDetailType, salesReturnMasterType } from "@/types/tables.type";
const purchaseApi = new ApiClient('/api/sales-return');

export const handleReturnSubmitSales = async ({ customer, saleMt, saleDts, isLoading, setIsLoading, onSubmited }: { customer: customerType, saleMt: salesReturnMasterType, saleDts: salesReturnDetailType[], isLoading: boolean, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, onSubmited: () => void }) => {
  alert('retring')
  if (isLoading) return
  try {
    setIsLoading(true)
    const purData = {
      mt: {
        "cust_id": customer?.cust_id!,
        "discount": Number(saleMt?.discount),
        "vat": Number(saleMt?.vat),
        "paid_amt": Number(saleMt?.paid_amt),
        "sales_date": saleMt?.sales_r_date ? new Date(saleMt?.sales_r_date) : new Date()

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
        success: 'success to return sale'
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