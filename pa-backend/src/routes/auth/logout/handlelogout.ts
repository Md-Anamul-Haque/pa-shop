import { sql } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
export const handleLogoutPOST = async (req: Request, res: Response) => {
    try {
        // ... handle POST logic start hear
        const session_id = req.auth?.user?.session_id as string
        const [logoutUser] = await sql`DELETE FROM user_session WHERE session_id=${session_id} RETURNING *`;
        console.log({ logoutUser })
        if (logoutUser?.session_id) {
            res.clearCookie('token', { path: "/" })
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                payload: logoutUser // your can any data for responce
            });
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_IMPLEMENTED',
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