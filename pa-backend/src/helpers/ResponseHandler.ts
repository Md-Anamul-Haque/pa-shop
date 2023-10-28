import { Response } from "express";

type responseHandlerType = {
    message?: string
} & {
    resType?: 'success',
    payload?: any;
} | {
    resType: 'error';
    message?: string;
} | {
    resType: 'authError';
    message?: string;
}
export const ResponseHandler = (res: Response, params: responseHandlerType) => {
    if (params?.resType === 'error') {
        console.log('this is errror responce')
        return res.json({
            "success": false,
            "message": params?.message || 'error',
        })
    } else if (params?.resType === 'authError') {
        console.log('you are not authorized')
        return res.json({
            "success": false,
            "message": params?.message || 'you are not a valid user.',
            "isAuth": 'no'
        })
    } else {
        return res.json({
            "success": true,
            "message": params?.message || 'success',
            payload: params?.payload || null
        })
    }
}