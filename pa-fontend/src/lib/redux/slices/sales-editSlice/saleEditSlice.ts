/* Core */
import { createSlice } from "@reduxjs/toolkit";

/* Instruments */
import {
  customerType,
  salesDetailType,
  salesMasterType,
} from "@/types/tables.type";
import _ from "lodash";
import { LoadEditableData } from "./thunks";
import { handleIgnoreStartZero } from "@/lib/utils";

const initialState: salesEditSliceState = {
  saleDts: [],
  isFetchingData: true,
  saleMt: { paid_amt: 0, cust_id: "", discount: 0, vat: 0 },
  customer: undefined,
  isLoading: false,
  _sum: 0,
  isError: ''
};
export type salesEditDetailType = salesDetailType & {
  isThis?: "edited" | "new";
};

type salesDetailTypes = salesEditDetailType[];

const get_sum = (state: salesEditSliceState) => {
  const newState = { ...state };
  if (newState.saleDts?.length) {
    const new_sum =
      _.sumBy(newState.saleDts, (sal) => Number(sal.qty) * Number(sal.unit_price)
      ) +
      Number(newState.saleMt?.vat || 0) -
      Number(newState.saleMt?.discount || 0) || 0;
    return new_sum;
  } else {
    return 0;
  }
};

const nextIndex = (
  saleDts: salesDetailTypes,
  idx: number,
  key: string,
  isnext: boolean
): { rowNumber: number; key: string } => {
  let returnValue = {
    rowNumber: idx,
    key: "",
  };

  // Check if idx is out of bounds
  if (idx < 0 || idx >= saleDts.length) {
    if (idx >= saleDts.length) {
      returnValue = nextIndex(saleDts, idx - 2, key, false);
    }
    if (idx < 0 && saleDts.length > 1) {
      returnValue = nextIndex(saleDts, 1, key, true);
    }
    return returnValue;
  }

  // Check if prod_id is undefined or null
  if (!saleDts[idx]?.prod_id) {
    console.log({ isnext });
    // Avoid infinite loop by ensuring that the recursion doesn't go beyond array bounds
    if (isnext && idx + 1 < saleDts.length) {
      returnValue = nextIndex(saleDts, idx + 1, key, isnext);
    } else if (!isnext && idx > 0) {
      // when isNext ===false and index not valid
      returnValue = nextIndex(saleDts, idx - 1, key, isnext);
    }
  } else {
    returnValue = {
      key: key,
      rowNumber: idx,
    };
  }
  return returnValue;
};

export const salesEditSlice = createSlice({
  name: "salesEdit",
  initialState,
  reducers: {
    setSupplier(state, action: { payload: customerType }) {
      const newSupp = action.payload;
      state.customer = newSupp;
      const new_sum = get_sum(state);
      state._sum = new_sum;
    },
    pushSale(state, action: { payload: { saleDetail: salesEditDetailType } }) {

      state.saleDts?.push({
        ...action.payload.saleDetail,
        isThis: "new",
      });

      const new_sum = get_sum({
        ...state,
        saleDts: [
          ...(state.saleDts || []),
          { ...action.payload.saleDetail, isThis: "new" },
        ],
      });
      state._sum = new_sum;
    },
    removeSale(state, action: { payload: number }) {
      // let pur_id = "";
      const newDts = state?.saleDts?.filter((sal, i) => {
        if (action.payload !== i) {
          return true;
        } else {
          // pur_id = pur.prod_id;
          if (sal.sales_dt_id) {
            state.removed = state.removed?.length ? [...state.removed, sal.sales_dt_id] : [sal.sales_dt_id];
          }
          return false;
        }
      });
      state.saleDts = newDts;
      const new_sum = get_sum({ ...state, saleDts: newDts });
      state._sum = new_sum;
    },
    setSaleDt(state, action: { payload: { IndexSale: number; editedSal?: salesEditDetailType } }) {
      const purs = state.saleDts || [];
      const editedSal = action.payload.editedSal;
      const IndexPur = action.payload.IndexSale;
      if (IndexPur < 0 || IndexPur >= purs.length) {
        console.error("Invalid index to edit.");
      }
      const newDts: salesDetailTypes = purs.map((sal, i) =>
        i === IndexPur
          ? { ...sal, ...editedSal, isThis: sal.isThis || "edited" }
          : sal
      );
      state.saleDts = newDts;
      const new_sum = get_sum({ ...state, saleDts: newDts });
      state._sum = new_sum;
    },
    changeFocus(
      state,
      action: {
        payload: "none" | { rowNumber: number; key: string; isNext: boolean };
      }
    ) {
      if (!state.saleDts?.length || state.saleDts?.length < 2) return;
      if (action.payload == "none") {
        state.isFocus = undefined;
      } else {
        const focus = nextIndex(
          state.saleDts,
          action.payload.rowNumber,
          action.payload.key,
          action.payload.isNext
        );
        state.isFocus = focus.key ? focus : undefined; // action.payload
        console.log({ ...focus });
      }
    },
    handleSetVat(state, action: { payload: string }) {
      state.saleMt = { ...state.saleMt, vat: handleIgnoreStartZero(action.payload) };
      const new_sum = get_sum({
        ...state,
        saleMt: { ...state.saleMt, vat: action.payload },
      });
      state._sum = new_sum;
    },
    handleSetDiscount(state, action: { payload: string }) {
      state.saleMt = {
        ...state.saleMt,
        discount: handleIgnoreStartZero(action.payload),
      };
      const new_sum = get_sum({
        ...state,
        saleMt: { ...state.saleMt, discount: action.payload },
      });
      state._sum = new_sum;
    },
    handleSetPaid_amt(state, action: { payload: string }) {
      state.saleMt = { ...state.saleMt, paid_amt: handleIgnoreStartZero(action.payload) };
    },
    handleSetSales_date(state, action: { payload: string | undefined }) {
      state.saleMt = { ...state.saleMt, sales_date: action.payload };
    },
    clearSales(state) {
      state = initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoadEditableData.pending, (state) => {
        state.isFetchingData = true;
        console.log({ loadEditable_pending: true })

      })
      .addCase(LoadEditableData.fulfilled, (state, action) => {
        console.log({ loadEditableFullfile: true })
        console.log({ action })
        state.isFetchingData = false
        state.saleMt = action.payload.mt;
        state.saleDts = action.payload.dts;
        state.customer = action.payload.customer;
        state._sum = get_sum({ ...state, saleMt: state.saleMt })

      }).addCase(LoadEditableData.rejected, (state, action) => {
        state.isFetchingData = false
        state.isError = String(action.error.message || action.error)
        console.log({ loadEditable_rejected: true })

      })
  },
});

/* Types */


export interface salesEditSliceState {
  customer?: customerType;
  saleDts?: salesDetailTypes;
  saleMt?: salesMasterType;
  isFocus?: { key: string; rowNumber: number }
  isLoading: boolean;
  isFetchingData: boolean;
  removed?: number[];
  isError?: string;
  // due: number;
  _sum: number;
}

