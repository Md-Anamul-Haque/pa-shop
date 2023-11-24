/* Core */
import { createSlice } from '@reduxjs/toolkit'

/* Instruments */
import { userType } from '@/types/tables.type'
import { userAsync } from './thunks'

const initialState: userSliceState = {
    isLoading: true,
    error: '',
    data: {},
    isAuth: 'loading'
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload
        },
        setIsAuth: (state, action) => {
            alert('auth is' + action.payload)
            state.isAuth = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(userAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success) {
                    state.data = action.payload.payload;
                    state.isAuth = 'yes'
                } else if (action.payload.isAuth == 'no') {
                    state.isAuth = 'no'
                }
            }).addCase(userAsync.rejected, (state, action) => {
                console.log({ action })
                state.isLoading = false
                state.error = action.error?.message || 'error';
            })
    },
})

/* Types */
export type userSliceState = {
    isLoading: boolean,
    error: string,
    data: userType,
    isAuth: 'yes' | 'no' | 'loading'
};