import config from '@/config';
import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const handleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const token = req.cookies?.['token'] || req.headers?.['authorization']; // req.headers?.['authorization'] this is for mobile application or others
        if (!token) {
            return ResponseHandler(res, {
                resType: 'authError',
                status: 'UNAUTHORIZED'
            });
        }
        // console.log(req.cookies)
        const decoded: any = jwt.verify(token, config.app.jwtSecretKey);
        const { user_id, ip: decodedIp } = decoded;
        if (decodedIp !== clientIP) { return ResponseHandler(res, { resType: 'authError', message: 'ip  not match' }) }
        console.log({ user_id })
        const { rows } = await pool.query(
            `SELECT u.org_code, u.user_id, u.first_name, u.last_name, u.email, u.password, u.role, u.is_active,
                    us.session_id, us.token, us.tokenClient, us.created_at, us.expires_at
             FROM USERS u
             JOIN user_session us ON u.user_id = us.user_id AND u.user_id = $1 AND u.is_active = true
             WHERE us.token = $2 AND us.user_id = $3`,
            [user_id, token, user_id]);
        console.log({ rows })
        const userAndSession = rows[0];
        if (user_id && userAndSession?.org_code && userAndSession?.user_id && userAndSession?.email) {
            req.auth = {
                user: {
                    first_name: userAndSession?.first_name || '',
                    last_name: userAndSession?.last_name || '',
                    user_id: userAndSession.user_id,
                    email: userAndSession.email,
                    role: userAndSession.role,
                    is_active: userAndSession.is_active,
                    org_code: userAndSession.org_code,
                    session_id: userAndSession.session_id,
                    ip: String(Array.isArray(clientIP) ? clientIP.join('_') : clientIP)
                }
            }
            console.log('yes pass auth')
            next()
        } else {
            return ResponseHandler(res, {
                resType: 'authError',
                status: 'UNAUTHORIZED'
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