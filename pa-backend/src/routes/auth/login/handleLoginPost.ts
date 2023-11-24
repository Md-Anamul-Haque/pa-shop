import config from '@/config';
import { pool, sql } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { userType } from '@/types/tables.type';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type findAndCheckUser_ReturnType = ({ isValid: false; error?: string } | { isValid: true; user: userType });
async function findAndCheckUser(email: string, password: string): Promise<findAndCheckUser_ReturnType> {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return { isValid: false, error: 'User not found' }; // User not found
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return { isValid: false, error: 'Invalid password' }; // Invalid password
        }

        return { isValid: true, user }; // User is valid
    } catch (error) {
        console.error('Error finding user:', error);
        return { isValid: false, error: (error as any)?.message }; // Error occurred
    }
}

export const handleLoginPOST = async (req: Request, res: Response) => {
    try {
        console.log('token', req.cookies?.['token'])
        const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (!clientIP) {
            throw new Error('not a valid request. clientIP not found');
        }
        const stringIp: string = Array.isArray(clientIP) ? clientIP.join('_') : clientIP
        console.log({ clientIP });
        // ... handle POST logic start hear
        const { email, password } = req.body;
        const checkUser = await findAndCheckUser(email, password);
        if (!checkUser.isValid) {
            throw new Error(checkUser?.error || 'you are not a valid user');
        }
        const { user } = checkUser;
        const { org_code, user_id } = user
        const token = jwt.sign({ user_id, email: user.email, ip: stringIp }, config.app.jwtSecretKey, { expiresIn: '1d' });
        const [session] = await sql`insert into user_session${sql({ org_code, user_id, token }, 'org_code', 'user_id', 'token')} returning user_id`;
        console.log({ session })
        if (!session || !session?.user_id) throw new Error('session not created');
        res.cookie('token', String(token), {
            // secure: process.env.NODE_ENV === 'development' ? false : true, 
            // sameSite: 'none',
            path: "/",
            httpOnly: true,  // only can get this server
            // domain: `.${process.env.CLINT_URL}`,
            // maxAge: ''
        });
        res.cookie("client_token/", String('tokenClient'), {
            // sameSite: 'none',
            path: "/",
            httpOnly: false,
            // domain: `.${process.env.CLINT_URL}`,
            // maxAge: ''
        });
        if (token) {
            return ResponseHandler(res, {
                resType: 'success',
                status: 'OK',
                message: '',
                payload: { token } // your can any data for responce
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
