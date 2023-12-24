import { Button as ShadCnUiButton } from "@/components/ui/button";
import { salesReturnDetailType } from "@/types/tables.type";

import { Accordion } from "@/components/ui/accordion";
import {
  salesReturn_Slice,
  selectSalesReturn,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { ArrowLeftIcon, TimerIcon } from "@radix-ui/react-icons";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "../DatePicker";
import { ProductTrMobile as ProductTr } from "./ProductTr.Mobile";
import { handleReturnSubmitSales } from "./handleSubmitPurchase";

const SalesReturnHandlerMobile = ({
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
    saleDts = [],
    isFocus,
    saleMt,
    customer,
    _sum,
  } = useSelector(selectSalesReturn);
  const handleChangePurchaseInfo = (dt: salesReturnDetailType, i: number) => {
    dispatch(
      salesReturn_Slice.actions.setSaleDt({
        IndexSale: i,
        editedSale: dt,
      })
    );
  };

  const handlePushPurchaseInfo = (dt: salesReturnDetailType) => {
    const indexOfrow = saleDts.length;
    const a = "item-" + indexOfrow + dt?.prod_id;
    setTimeout(() => {
      setDefaultValue(a);
    }, 300);
    // ------------


    dispatch(
      salesReturn_Slice.actions.pushSaleReturn({
        saleDetail: dt,
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
      saleDts,
      (purchase) => Number(purchase.qty) * Number(purchase.unit_price)
    ) || 0;
  const handleSubmit = async () => {
    if (!customer || !saleMt) {
      console.log({ saleMt, customer });
      return;
    }
    handleReturnSubmitSales({
      isLoading,
      customer,
      saleMt,
      setIsLoading,
      onSubmited,
      saleDts
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
          {saleDts.map((saleDt, i) => (
            <ProductTr
              isFocus={isFocus}
              dispatch={dispatch}
              onChange={(prodInfo) => {
                handleChangePurchaseInfo(prodInfo, i);
              }}
              saleDt={saleDt}
              key={String(i + 100)}
              indexOfrow={i}
            />
          ))}
        </Accordion>
        <br />
        <ProductTr
          dispatch={dispatch}
          onChange={handlePushPurchaseInfo}
          indexOfrow={saleDts.length}
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
                    sales_r_date <TimerIcon /> :
                  </span>
                </td>
                <td className="text-right border px-2 py-1">
                  <DatePicker
                    value={
                      saleMt?.sales_r_date
                        ? new Date(saleMt?.sales_r_date)
                        : undefined
                    }
                    onSelect={(date) => {
                      dispatch(
                        salesReturn_Slice.actions.handleSetPur_r_date(
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
                    value={saleMt?.discount}
                    size="small"
                    label="discount:{'- ৳'}"
                    type="number"
                    onChange={(e) => {
                      dispatch(
                        salesReturn_Slice.actions.handleSetDiscount(
                          e.target.value
                        )
                      );
                    }}
                    disabled={!(_sum || saleDts.length)}
                    required
                  />
                </td>
              </tr>
              <tr className="border">
                <td className="text-right border px-2 py-1">vat:{"- ৳"} : </td>
                <td className="text-right border px-2 py-1">
                  <TextField
                    fullWidth
                    value={saleMt?.vat}
                    size="small"
                    label="vat:{'- ৳'}"
                    type="number"
                    onChange={(e) => {
                      dispatch(
                        salesReturn_Slice.actions.handleSetVat(
                          e.target.value
                        )
                      );
                    }}
                    disabled={!(_sum || saleDts.length)}
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
                    value={saleMt?.paid_amt}
                    size="small"
                    label="paid_amt:{'- ৳'}"
                    type="number"
                    onChange={(e) => {
                      dispatch(
                        salesReturn_Slice.actions.handleSetPaid_amt(
                          e.target.value
                        )
                      );
                    }}
                    disabled={!(_sum || saleDts.length)}
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
                  {_sum - Number(saleMt?.paid_amt || 0)}{" "}
                </td>
              </tr>
              <tr>
                <td className="" colSpan={6}>
                  <ShadCnUiButton
                    isLoading={isLoading}
                    onClick={handleSubmit}
                    className="w-full"
                    type="submit"
                    disabled={!(_sum || saleDts.length)}
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

export default SalesReturnHandlerMobile;
