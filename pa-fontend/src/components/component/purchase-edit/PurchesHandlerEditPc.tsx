import { purchaseDetailType } from "@/types/tables.type";

import { Button as ShadCnUiButton } from "@/components/ui/button";
import {
  purchaseEditSlice,
  selectPurchaseEdit,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { TextField } from "@mui/material";
// import Button from "@mui/material/Button";
import { TimerIcon } from "@radix-ui/react-icons";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "../DatePicker";
import { ProductTrPc as ProductTr } from "./ProductTr.pc";
import { handleSaveEditPurchase } from "./handleSaveEditPurchase";

const PurchesHandlerEditPc = ({ onSubmited }: { onSubmited: () => void }) => {
  // const p: productType;
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const purchaseEditState = useSelector(selectPurchaseEdit);
  const {
    purchaseDts = [],
    isFocus,
    purchaseMt,
    _sum,
  } = purchaseEditState
  const handleChangePurchaseInfo = (dt: purchaseDetailType, i: number) => {
    dispatch(
      purchaseEditSlice.actions.setPurchaseDt({
        IndexPur: i,
        editedPur: dt,
      })
    );
  };

  const handlePushPurchaseInfo = (dt: purchaseDetailType) => {
    dispatch(
      purchaseEditSlice.actions.pushPurchase({
        purchaseDetail: dt,
      })
    );
  };
  useEffect(() => {
    if (ref.current) {
      const windowHeight = window.innerHeight || 0;
      const offsetTop = ref.current.offsetTop || 0;
      ref.current.style.maxHeight = `${windowHeight - (offsetTop + 10)}px`;
    }
  }, []);
  const totalSumBy = () =>
    _.sumBy(
      purchaseDts,
      (purchase) => Number(purchase.qty) * Number(purchase.unit_price)
    );
  const handleSubmit = async () => {
    // if (!supplier || !purchaseMt) {
    //   console.log({ purchaseMt, supplier });
    //   return;
    // }
    handleSaveEditPurchase({
      isLoading,
      onSubmited,
      purchaseEditState,
      setIsLoading
    });
  };
  return (
    <div className="w-full">
      <div className="flex justify-around items-center py-1">
        <h1 className="text-xl">Purches List</h1>
      </div>
      <div ref={ref} className="relative h-fit">
        <table className="colspan border-collapse w-full">
          <thead className="sticky top-0 bg-accent z-10 h-fit w-full">
            <tr>
              <th className="purchesList border w-9">SL</th>
              <th className="purchesList border w-44">prod_name</th>
              <th className="purchesList border w-20">QTY</th>
              <th className="purchesList border w-10">uom</th>
              <th
                className="purchesList border w-32"
                title="purches unit price"
              >
                pur_price
              </th>
              <th className="purchesList border w-36">Total</th>
            </tr>
          </thead>
          <tbody>
            {purchaseDts.map((purchaseDt, i) => (
              <ProductTr
                isFocus={isFocus}
                dispatch={dispatch}
                onChange={(prodInfo) => {
                  handleChangePurchaseInfo(prodInfo, i);
                }}
                purchaseDt={purchaseDt}
                key={String(i + 100)}
                indexOfrow={i}
              />
            ))}
            <ProductTr
              dispatch={dispatch}
              onChange={handlePushPurchaseInfo}
              indexOfrow={purchaseDts.length}
            />
            <tr className="border">
              <td className="text-right border px-2 py-1" colSpan={5}>
                Totals {"- ৳"}:{" "}
              </td>
              <td className="text-right border px-2 py-1">{totalSumBy()}</td>
            </tr>
            <tr className="border">
              <td className="text-right border px-2 py-1" colSpan={5}>
                <span className="flex justify-end space-x-3 items-center">
                  pur_date <TimerIcon /> :
                </span>
              </td>
              <td className="text-right border px-2 py-1">
                <DatePicker
                  value={
                    purchaseMt?.pur_date
                      ? new Date(purchaseMt?.pur_date)
                      : undefined
                  }
                  onSelect={(date) => {
                    dispatch(
                      purchaseEditSlice.actions.handleSetPur_date(
                        date?.toISOString()
                      )
                    );
                  }}
                />
              </td>
            </tr>
            <tr className="border">
              <td className="text-right border px-2 py-1" colSpan={5}>
                discount:{"- ৳"} :{" "}
              </td>
              <td className="text-right border px-2 py-1">
                <TextField
                  fullWidth
                  value={purchaseMt?.discount}
                  size="small"
                  label="discount:{'- ৳'}"
                  type="number"
                  onChange={(e) => {
                    dispatch(
                      purchaseEditSlice.actions.handleSetDiscount(
                        e.target.value
                      )
                    );
                  }}
                  disabled={!(_sum || purchaseDts.length)}
                  required
                />
              </td>
            </tr>
            <tr className="border">
              <td className="text-right border px-2 py-1" colSpan={5}>
                vat:{"- ৳"} :{" "}
              </td>
              <td className="text-right border px-2 py-1">
                <TextField
                  fullWidth
                  value={purchaseMt?.vat}
                  size="small"
                  label="vat:{'- ৳'}"
                  type="number"
                  onChange={(e) => {
                    dispatch(
                      purchaseEditSlice.actions.handleSetVat(
                        e.target.value
                      )
                    );
                  }}
                  disabled={!(_sum || purchaseDts.length)}
                  required
                />
              </td>
            </tr>
            <tr className="border">
              <td className="text-right border px-2 py-1" colSpan={5}>
                paid_amt:{"- ৳"} :{" "}
              </td>
              <td className="text-right border px-2 py-1">
                <TextField
                  fullWidth
                  value={purchaseMt?.paid_amt}
                  size="small"
                  label="paid_amt:{'- ৳'}"
                  type="number"
                  onChange={(e) => {
                    dispatch(
                      purchaseEditSlice.actions.handleSetPaid_amt(
                        e.target.value
                      )
                    );

                  }}
                  disabled={!(_sum || purchaseDts.length)}
                  required
                />
              </td>
            </tr>
            <tr className="border">
              <td
                className=" font-mono text-center border px-2 py-1"
                colSpan={6}
              >
                total amt:{"- ৳"} :{_sum} &nbsp; . due:{"- ৳"} :
                {_sum - Number(purchaseMt?.paid_amt || 0)}{" "}
              </td>
            </tr>
            <tr>
              <td className="" colSpan={5}></td>
              <td>
                <ShadCnUiButton
                  isLoading={isLoading}
                  onClick={handleSubmit}
                  className="w-full"
                  type="submit"
                  disabled={!(_sum || purchaseDts.length)}
                >
                  save Change{' (Purchase)'}
                </ShadCnUiButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchesHandlerEditPc;
