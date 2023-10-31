import db from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { userType } from '@/types/tables.type';
import bcrypt from 'bcrypt';
import Joi from 'joi';
const schema = Joi.object({
    org_code: Joi.string(),
    username: Joi.string().min(3).max(40).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(18).required(),
    role: Joi.string().required(),
    is_active: Joi.boolean().required()
});
export const handleUserPOST = async (req: Request, res: Response) => {
    try {
        // ... handle POST logic start hear

        const org_code = req.auth?.user?.org_code;
        const { username, password, email, role, is_active }: userType & { password: string } = req.body;
        // if (!username || !password || !email) throw new Error('username,password,email and role is required');
        const { error: validationError } = schema.validate({ org_code, username, password, email, role, is_active });
        if (validationError) {
            throw new Error(validationError.details[0].message)
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            // Store hash in your password DB.
            if (err) throw new Error(err.message);
            const { rows } = await db.query(`INSERT INTO USERS 
            (org_code, user_id, username, email, password, role, is_active)
             VALUES(
                $1,
                (SELECT 'U_'|| COALESCE(MAX(CAST(SPLIT_PART(user_id, '_', 2) AS INTEGER)), 0)+1 FROM USERS),
                $2,
                $3,
                $4,
                $5,
                $6
                )
             RETURNING *`, [org_code, username, email, password, role, is_active])
            const newUser: userType = rows[0];
            if (newUser) {
                return ResponseHandler(res, {
                    resType: 'success',
                    status: 'CREATED',
                    payload: newUser
                });
            } else {
                return ResponseHandler(res, {
                    resType: 'error',
                    status: 'EXPECTATION_FAILED',
                    message: 'error message'
                });
            }
        });

    } catch (error) {
        console.log({ error })
        return ResponseHandler(res, {
            resType: 'error',
            status: 'INTERNAL_SERVER_ERROR',
            message: (error as any)?.message || ''  //your can any message 
        });
    }
}