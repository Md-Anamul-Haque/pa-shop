import db from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from 'express';
export const handleOrgGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear



        const DbQueryResult = await db.query('select orgcode as "orgCode"  from org');
        console.log(DbQueryResult.rows)
        // ... handle GET logic end hear
        if ('condition') {
            ResponseHandler(res, {
                resType: 'success',
                message: '',
                payload: DbQueryResult.rows // your can any data for responce
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