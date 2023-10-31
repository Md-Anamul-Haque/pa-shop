import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { NextFunction } from 'express';
const handleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if ('condition') {
            req.auth = {
                user: {
                    username: '',
                    user_id: '',
                    email: 'm.anamul.dev@gmail.com',
                    role: 'su_admin',
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
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req?.auth?.user?.role === 'admin' || req?.auth?.user?.role === 'su_admin') {
            next()
        } else {
            return ResponseHandler(res, {
                resType: 'error',
                status: 'NOT_ACCEPTABLE',
                message: 'you are not admin',
            });
        }
    } catch (error) {
        return ResponseHandler(res, {
            resType: 'error',
            message: (error as any)?.message || ''  //your can any message 
        })
    }
}
const isSu_admin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req?.auth?.user?.role === 'su_admin') {
            console.log('yes is dev')
            next()
        } else {
            return ResponseHandler(res, {
                resType: 'authError',
                status: 'UNAUTHORIZED',
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
    isAdmin: isAdmin,
    isSu_admin: isSu_admin

})