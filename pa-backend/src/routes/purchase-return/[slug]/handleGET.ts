import { sql } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handlePurchaseGET = async (req: Request, res: Response) => {
    try {
        // ... handle GET logic start hear
        const pur_id = req.params.slug;
        const org_code = req.auth?.user?.org_code as string;
        console.log({ org_code })

        const mtData = await sql`SELECT * FROM purchase_return_mt WHERE pur_id = ${pur_id} AND org_code = ${org_code}`
        const dtsData = await sql`SELECT * FROM purchase_return_dt WHERE pur_id = ${pur_id} AND org_code = ${org_code}`

        if (mtData?.[0]) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: { mt: mtData[0], dts: dtsData } // your can any data for responce
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_FOUND',
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