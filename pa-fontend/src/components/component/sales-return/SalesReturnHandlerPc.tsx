
import { Button as ShadCnUiButton } from "@/components/ui/button";
import {
  salesReturn_Slice,
  selectSalesReturn,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { TimerIcon } from "@radix-ui/react-icons";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "../DatePicker";
import { ProductTrPc as ProductTr } from "./ProductTr.pc";
import { handleReturnSubmitSales } from "./handleSubmitPurchase";
import { salesReturnDetailType } from "@/types/tables.type";

const SalesReturnHandlerPc = ({
  onNext,
  onSubmited,
}: {
  onNext: (incre: number) => void;
  onSubmited: () => void;
}) => {
  // const p: productType;
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    saleDts = [],
    isFocus,
    saleMt,
    customer,
    _sum,
  } = useSelector(selectSalesReturn);
  const handleChangesalesInfo = (dt: salesReturnDetailType, i: number) => {
    dispatch(
      salesReturn_Slice.actions.setSaleDt({
        IndexSale: i,
        editedSale: dt,
      })
    );
  };

  const handlePushsalesInfo = (dt: salesReturnDetailType) => {
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
      (sales) => Number(sales.qty) * Number(sales.unit_price)
    );
  const handleSubmit = async () => {
    if (!customer || !saleMt) {
      console.log({ saleMt, customer });
      return;
    }
    handleReturnSubmitSales({
      isLoading,
      saleDts,
      saleMt,
      setIsLoading,
      customer,
      onSubmited,
    });
  };
  return (
    <div className="w-full">
      <div className="flex justify-around items-center py-1">
        <Button variant="contained" onClick={() => onNext(-1)}>
          Back
        </Button>
        <h1 className="text-xl">Purches List</h1>
        {/* <form className="space-x-2">
                    <Input label="search " className=" w-56" />
                </form> */}
        <span></span>
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
            {saleDts.map((saleDt, i) => (
              <ProductTr
                isFocus={isFocus}
                dispatch={dispatch}
                onChange={(prodInfo) => {
                  handleChangesalesInfo(prodInfo, i);
                }}
                saleDt={saleDt}
                key={String(i + 100)}
                indexOfrow={i}
              />
            ))}
            <ProductTr
              dispatch={dispatch}
              onChange={handlePushsalesInfo}
              indexOfrow={saleDts.length}
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
              <td className="text-right border px-2 py-1" colSpan={5}>
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
              <td className="text-right border px-2 py-1" colSpan={5}>
                vat:{"- ৳"} :{" "}
              </td>
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
              <td className="text-right border px-2 py-1" colSpan={5}>
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
                colSpan={6}
              >
                total amt:{"- ৳"} :{_sum} &nbsp; . due:{"- ৳"} :
                {_sum - Number(saleMt?.paid_amt || 0)}{" "}
              </td>
            </tr>
            {/* 
                        <tr className='border'>
                            <td colSpan={2} className='text-right border px-2 py-1'>total amt:</td>
                            <td className='text-right border px-2 py-1'>{_sum}</td>
                            <td className='text-right border px-2 py-1' colSpan={2}>due:{'- ৳'} : </td>
                            <td className='text-right border px-2 py-1'>
                                {_sum - Number(saleMt?.paid_amt || 0)}
                            </td>
                        </tr> */}
            <tr>
              <td className="" colSpan={5}></td>
              <td>
                <ShadCnUiButton
                  isLoading={isLoading}
                  onClick={handleSubmit}
                  className="w-full"
                  type="submit"
                  disabled={!(_sum || saleDts.length)}
                >
                  sales now
                </ShadCnUiButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReturnHandlerPc;
