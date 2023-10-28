import db from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from 'express';
export const handleOrgPOST = async (req: Request, res: Response) => {
    try {
        // ... handle POST logic start hear



        const DbQueryResult = db.query('select 1+2')
        // ... handle POST logic end hear
        if ('condition') {
            ResponseHandler(res, {
                resType: 'success',
                message: '',
                payload: '' // your can any data for responce
            })
        } else {
            ResponseHandler(res, {
                resType: 'error',
                message: 'error message  //your can any message'
            });
        }
    } catch (error) {
        ResponseHandler(res, {
            resType: 'error',
            message: (error as any)?.message || ''  //your can any message 
        })
    }
}