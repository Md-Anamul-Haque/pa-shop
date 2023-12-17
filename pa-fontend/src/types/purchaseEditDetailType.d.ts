import { purchaseDetailType } from "./tables.type";

export type purchaseEditDetailType = purchaseDetailType & {
    isThis?: "edited" | "new";
  };