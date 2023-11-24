import ApiClient from "@/lib/ApiClient"
import { apiResponceType } from "@/types/apiResponceType"
import { userType } from "@/types/tables.type"
const userApi = new ApiClient('/api/auth/me')
export const fetchIdentityUser = async (): Promise<{ user?: userType, error?: string }> => {

    // try {
    const response = await userApi.get<userType>('', { withToast: true })
    console.log({ response })
    const result: apiResponceType | any = response
    // alert(JSON.stringify(result))
    return result.payload
    // } catch (error: any) {
    //     console.error('Error fetching data:', error);
    //     // throw new Error(String(error));
    //     return {
    //         error
    //     }
    // }
}