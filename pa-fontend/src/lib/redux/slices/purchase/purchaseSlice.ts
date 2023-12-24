/* Core */
import { createSlice } from "@reduxjs/toolkit";

/* Instruments */
import {
  purchaseDetailType,
  purchaseMasterType,
  supplierType,
} from "@/types/tables.type";
import _ from "lodash";
import { handleIgnoreStartZero } from "@/lib/utils";

const initialState: purchaseSliceState = {
  purchaseDts: [],
  purchaseMt: { paid_amt: 0, supp_id: "", discount: 0, vat: 0 },
  supplier: undefined,
  isLoading: false,
  _sum: 0,
};

const get_sum = (state: purchaseSliceState) => {
  const newState = { ...state };
  if (newState.purchaseDts?.length) {
    const new_sum =
      _.sumBy(
        newState.purchaseDts,
        (purchase) => Number(purchase.qty) * Number(purchase.unit_price)
      ) +
      Number(newState.purchaseMt?.vat || 0) -
      Number(newState.purchaseMt?.discount || 0) || 0;
    return new_sum;
  } else {
    return 0;
  }
};

const nextIndex = (
  purchaseDts: purchaseDetailType[],
  idx: number,
  key: string,
  isnext: boolean
): { rowNumber: number; key: string } => {
  let returnValue = {
    rowNumber: idx,
    key: "",
  };

  // Check if idx is out of bounds
  if (idx < 0 || idx >= purchaseDts.length) {
    if (idx >= purchaseDts.length) {
      returnValue = nextIndex(purchaseDts, idx - 2, key, false);
    }
    if (idx < 0 && purchaseDts.length > 1) {
      returnValue = nextIndex(purchaseDts, 1, key, true);
    }
    return returnValue;
  }

  // Check if prod_id is undefined or null
  if (!purchaseDts[idx]?.prod_id) {
    console.log({ isnext });
    // Avoid infinite loop by ensuring that the recursion doesn't go beyond array bounds
    if (isnext && idx + 1 < purchaseDts.length) {
      returnValue = nextIndex(purchaseDts, idx + 1, key, isnext);
    } else if (!isnext && idx > 0) {
      // when isNext ===false and index not valid
      returnValue = nextIndex(purchaseDts, idx - 1, key, isnext);
    }
  } else {
    returnValue = {
      key: key,
      rowNumber: idx,
    };
  }
  return returnValue;
};

// function handleClearPurchase(state: purchaseSliceState) {
//     state.isLoading = false
//     state.purchaseDts = [];
//     state.purchaseMt = { paid_amt: 0, supp_id: '', };
//     state.supplier = undefined;
//     state.isFocus = undefined;
//     console.log('clear')
//     console.log(state)
//     return state;
// }
export const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    setSupplier(state, action: { payload: supplierType }) {
      const newSupp = action.payload;
      state.supplier = newSupp;
      const new_sum = get_sum(state);
      state._sum = new_sum;
    },
    pushPurchase(
      state,
      action: { payload: { purchaseDetail: purchaseDetailType } }
    ) {
      state.purchaseDts?.push(action.payload.purchaseDetail);
      const new_sum = get_sum({
        ...state,
        purchaseDts: [
          ...(state.purchaseDts || []),
          action.payload.purchaseDetail,
        ],
      });
      state._sum = new_sum;
    },
    removePurchase(state, action: { payload: number }) {
      const newDts = state?.purchaseDts?.filter(
        (_pur, i) => action.payload !== i
      );
      state.purchaseDts = newDts;
      const new_sum = get_sum({ ...state, purchaseDts: newDts });
      state._sum = new_sum;
    },
    setPurchaseDt(
      state,
      action: { payload: { IndexPur: number; editedPur?: purchaseDetailType } }
    ) {
      const purs = state.purchaseDts || [];
      const editedPur = action.payload.editedPur;
      const IndexPur = action.payload.IndexPur;
      if (IndexPur < 0 || IndexPur >= purs.length) {
        console.error("Invalid index to edit.");
      }
      const newDts = purs.map((pur, i) =>
        i === IndexPur ? { ...pur, ...editedPur } : pur
      );
      state.purchaseDts = newDts;
      const new_sum = get_sum({ ...state, purchaseDts: newDts });
      state._sum = new_sum;
    },
    changeFocus(
      state,
      action: {
        payload: "none" | { rowNumber: number; key: string; isNext: boolean };
      }
    ) {
      if (!state.purchaseDts?.length || state.purchaseDts?.length < 2) return;
      if (action.payload == "none") {
        state.isFocus = undefined;
      } else {
        const focus = nextIndex(
          state.purchaseDts,
          action.payload.rowNumber,
          action.payload.key,
          action.payload.isNext
        );
        state.isFocus = focus.key ? focus : undefined; // action.payload
        console.log({ ...focus });
      }
    },
    handleSetVat(state, action: { payload: string }) {
      state.purchaseMt = { ...state.purchaseMt, vat: handleIgnoreStartZero(action.payload) };
      const new_sum = get_sum({
        ...state,
        purchaseMt: { ...state.purchaseMt, vat: action.payload },
      });
      state._sum = new_sum;
      // alert(new_sum)
    },
    handleSetDiscount(state, action: { payload: string }) {
      state.purchaseMt = {
        ...state.purchaseMt,
        discount: handleIgnoreStartZero(action.payload),
      };
      const new_sum = get_sum({
        ...state,
        purchaseMt: { ...state.purchaseMt, discount: action.payload },
      });
      state._sum = new_sum;
    },
    handleSetPaid_amt(state, action: { payload: string }) {
      state.purchaseMt = { ...state.purchaseMt, paid_amt: handleIgnoreStartZero(action.payload) };
    },
    handleSetPur_date(state, action: { payload: string | undefined }) {
      state.purchaseMt = { ...state.purchaseMt, pur_date: action.payload };
    },
    clearPurchase: (state) => {
      state = initialState;
      // return handleClearPurchase(state);
    },
  },
});

/* Types */
export interface purchaseSliceState {
  supplier?: supplierType;
  purchaseDts?: purchaseDetailType[];
  purchaseMt?: purchaseMasterType;
  isFocus?: { key: string; rowNumber: number };
  isLoading: boolean;
  error?: string;
  _sum: number;
}
