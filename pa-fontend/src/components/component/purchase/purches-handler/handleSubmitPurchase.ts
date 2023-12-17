import ApiClient from "@/lib/ApiClient";
import {
  purchaseDetailType,
  purchaseMasterType,
  supplierType,
} from "@/types/tables.type";
const purchaseApi = new ApiClient("/api/purchase");

export const handleSubmitPurchase = async ({
  supplier,
  purchaseMt,
  purchaseDts,
  isLoading,
  setIsLoading,
  onSubmited,
}: {
  supplier: supplierType;
  purchaseMt: purchaseMasterType;
  purchaseDts: purchaseDetailType[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmited: () => void;
}) => {
  // e.preventDefault()
  if (isLoading) return;
  try {
    setIsLoading(true);
    const purData = {
      mt: {
        supp_id: supplier?.supp_id!,
        discount: Number(purchaseMt?.discount) || 0,
        vat: Number(purchaseMt?.vat) || 0,
        paid_amt: Number(purchaseMt?.paid_amt) || 0,
        pur_date: purchaseMt?.pur_date
          ? new Date(purchaseMt?.pur_date)
          : new Date(),
      },
      dts: purchaseDts?.map((pdt) => {
        return {
          prod_id: pdt.prod_id,
          qty: pdt.qty || 0,
          unit_price: pdt.unit_price || 0,
        };
      }),
    };
    const res = await purchaseApi.post("", {
      withToast: true,
      data: purData,
      toastMessages: {
        success: "success to purchase",
      },
    });

    setTimeout(() => {
      if (res.success) {
        onSubmited();
      }
      setIsLoading(false);
    }, 1000);
  } catch (error) {
    setIsLoading(false);
  }
};
