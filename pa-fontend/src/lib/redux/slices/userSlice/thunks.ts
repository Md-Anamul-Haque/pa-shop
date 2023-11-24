/* Instruments */
import ApiClient from '@/lib/ApiClient';
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk';
import { userType } from '@/types/tables.type';
const userApi = new ApiClient('/api/auth/me')

export const userAsync = createAppAsyncThunk(
    'user/fetchIdentityUser',
    async () => {
        const response = await userApi.get<userType>()
        console.log({ response })
        return response
    }
);