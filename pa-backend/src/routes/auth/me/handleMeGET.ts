import { ResponseHandler } from '@/helpers/ResponseHandler';
import { type Request, type Response } from '@/types/request&responce.type';
export const handleMeGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear
        // const DbQueryResult =await sql`select 1+2`;
        const me = req.auth?.user



        if (me) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: { ...me, password: '...' } // your can any data for responce
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_IMPLEMENTED',
                message: 'error message'  //your can any message'
            });
        }
    } catch (error) {
        return ResponseHandler(res, {
            resType: 'error',
            status: 'INTERNAL_SERVER_ERROR',
            message: (error as any)?.message || ''  //your can any message 
        });
    }
}