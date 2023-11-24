import { Response } from "express";
import { StatusCodes } from 'http-status-codes';
type responseHandlerType = {
    message?: string;
    status?: keyof typeof StatusCodes;
} & {
    resType?: 'success',
    payload?: any;
    status?: keyof typeof StatusCodes;
} | {
    resType: 'error';
    message?: string;
    status?: keyof typeof StatusCodes;
} | {
    resType: 'authError';
    message?: string;
    status?: keyof typeof StatusCodes;
}

export const ResponseHandler = (res: Response, params: responseHandlerType) => {
    const status = (params?.status ? params?.status : params?.resType === 'authError' ? "UNAUTHORIZED" : "OK");
    // console.log({ status })
    const statusCode = /^\d+$/.test(status) ? Number(status) : StatusCodes?.[status] || 200;
    if (params?.resType === 'error') {
        // console.log('this is errror responce')
        return res.status(statusCode).json({
            "success": false,
            "message": params?.message || StatusCodes[statusCode] || 'error',
        })
    } else if (params?.resType === 'authError') {
        // console.log('you are not authorized') res with status 200 is must for "fontend handle"
        return res.status(200).json({
            "success": false,
            "message": params?.message || StatusCodes[statusCode], // || 'Unauthorized: User not logged in',
            "isAuth": 'no'
        })
    } else {
        return res.status(statusCode).json({
            "success": true,
            "message": params?.message || StatusCodes[statusCode] || 'success',
            payload: params?.payload || null
        })
    }
}
