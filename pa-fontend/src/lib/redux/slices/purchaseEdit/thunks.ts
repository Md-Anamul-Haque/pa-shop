/* Instruments */

import ApiClient from "@/lib/ApiClient";
import { createAppAsyncThunk } from "../../createAppAsyncThunk"
const purchaseApi = new ApiClient("/api/purchase");


export const LoadEditableData = createAppAsyncThunk('purchase/loadEditable_purchaseData',async (pur_id: string) => {
        const response = await purchaseApi.get("/" + pur_id)
         if(!response.success){
            throw new Error(response.message)
        }
        // The value we return becomes the `fulfilled` action payload
        return response.payload
    }
)