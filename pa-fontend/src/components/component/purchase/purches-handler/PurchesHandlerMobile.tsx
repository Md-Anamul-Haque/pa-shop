import { Button as ShadCnUiButton } from "@/components/ui/button";
import { purchaseDetailType } from "@/types/tables.type";

import { Accordion } from "@/components/ui/accordion";
import {
  purchaseSlice,
  selectPurchase,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { ArrowLeftIcon, TimerIcon } from "@radix-ui/react-icons";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "../../DatePicker";
import { ProductTrMobile as ProductTr } from "./ProductTr.Mobile";
import { handleSubmitPurchase } from "./handleSubmitPurchase";

const PurchesHandlerMobile = ({
  onNext,
  onSubmited,
}: {
  onNext: (incre: number) => void;
  onSubmited: () => void;
}) => {
  // const p: productType;
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [defaultValue, setDefaultValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    purchaseDts = [],
    isFocus,
    purchaseMt,
    supplier,
    _sum,
  } = useSelector(selectPurchase);
  const handleChangePurchaseInfo = (dt: purchaseDetailType, i: number) => {
    dispatch(
      purchaseSlice.actions.setPurchaseDt({
        IndexPur: i,
        editedPur: dt,
      })
    );
  };

  const handlePushPurchaseInfo = (dt: purchaseDetailType) => {
    const indexOfrow = purchaseDts.length;
    const a = "item-" + indexOfrow + dt?.prod_id;
    setTimeout(() => {
      setDefaultValue(a);
    }, 300);
    // ------------
    dispatch(
      purchaseSlice.actions.pushPurchase({
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
    ) || 0;
  const handleSubmit = async () => {
    if (!supplier || !purchaseMt) {
      console.log({ purchaseMt, supplier });
      return;
    }
    handleSubmitPurchase({
      isLoading,
      purchaseDts,
      purchaseMt,
      setIsLoading,
      supplier,
      onSubmited,
    });
  };
  return (
    <div className="w-full max-w-screen-sm mx-auto">
      {defaultValue}
      <div className="flex justify-around items-center py-1">
        <Button variant="contained" onClick={() => onNext(-1)}>
          <ArrowLeftIcon className="w-6 h-6 mr-2" />
          Back
        </Button>
        <h1 className="text-xl">Purches List</h1>
      </div>
      <div ref={ref} className="relative h-fit overflow-auto ">
        <Accordion
          value={defaultValue}
          onValueChange={setDefaultValue}
          type="single"
          className="space-y-3"
          collapsible
        >
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
        </Accordion>
        <br />
        <ProductTr
          dispatch={dispatch}
          onChange={handlePushPurchaseInfo}
          indexOfrow={purchaseDts.length}
        />
        <section className="mt-5">
          <hr />
          <table className="mt-20 ml-auto">
            <tbody>
              <tr className="border">
                <td className="text-right border px-2 py-1">
                  Totals: {"- ৳"}:{" "}
                </td>
                <td className="text-right border px-2 py-1">{totalSumBy()}</td>
              </tr>
              <tr className="border">
                <td className="text-right border px-2 py-1">
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
                        purchaseSlice.actions.handleSetPur_date(
                          date?.toISOString()
                        )
                      );
                    }}
                  />
                </td>
              </tr>
              <tr className="border">
                <td className="text-right border px-2 py-1">
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
                        purchaseSlice.actions.handleSetDiscount(
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
                <td className="text-right border px-2 py-1">vat:{"- ৳"} : </td>
                <td className="text-right border px-2 py-1">
                  <TextField
                    fullWidth
                    value={purchaseMt?.vat}
                    size="small"
                    label="vat:{'- ৳'}"
                    type="number"
                    onChange={(e) => {
                      dispatch(
                        purchaseSlice.actions.handleSetVat(
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
                <td className="text-right border px-2 py-1">
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
                        purchaseSlice.actions.handleSetPaid_amt(
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
                  colSpan={2}
                >
                  total amt:{"- ৳"} :{_sum} &nbsp; . due:{"- ৳"} :
                  {_sum - Number(purchaseMt?.paid_amt || 0)}{" "}
                </td>
              </tr>
              <tr>
                <td className="" colSpan={6}>
                  <ShadCnUiButton
                    isLoading={isLoading}
                    onClick={handleSubmit}
                    className="w-full"
                    type="submit"
                    disabled={!(_sum || purchaseDts.length)}
                  >
                    Purchase now
                  </ShadCnUiButton>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default PurchesHandlerMobile;
