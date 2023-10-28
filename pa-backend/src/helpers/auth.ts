import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { NextFunction } from 'express';
const handleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // ... handle auth logic start hear


        // const DbQueryResult = db.query('select 1+2')
        // ... handle auth logic end hear
        if ('condition') {
            req.auth = {
                user: {
                    username: '',
                    user_id: '',
                    role: 'admin',
                    is_active: true,
                    org_code: 'org_1',
                }
            }
            console.log('yes pass auth')
            next()
        } else {
            return ResponseHandler(res, {
                resType: 'authError',
                message: 'error message  //your can any message'
            });
        }
    } catch (error) {
        return ResponseHandler(res, {
            resType: 'error',
            message: (error as any)?.message || ''  //your can any message 
        })
    }
}

export const auth = Object.assign(handleAuth, {
    isAdmin: handleAuth
})