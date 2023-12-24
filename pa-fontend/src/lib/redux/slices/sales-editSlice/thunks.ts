/* Instruments */

import ApiClient from "@/lib/ApiClient";
import { createAppAsyncThunk } from "../../createAppAsyncThunk"
const saleApi = new ApiClient("/api/sales");


export const LoadEditableData = createAppAsyncThunk('sales/loadEditable_salesData', async (sales_id: string) => {
    const response = await saleApi.get("/" + sales_id)
    if (!response.success) {
        throw new Error(response.message)
    }
    // The value we return becomes the `fulfilled` action payload
    return response.payload
}
)