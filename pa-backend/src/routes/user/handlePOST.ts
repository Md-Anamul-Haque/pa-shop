import { pool } from '@/config/db';
import { ResponseHandler } from '@/helpers/ResponseHandler';
import { Request, Response } from '@/types/request&responce.type';
import { userType } from '@/types/tables.type';
import bcrypt from 'bcrypt';
import Joi from 'joi';
const schema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    org_code: Joi.string(),
    // username: Joi.string().min(3).max(40).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(18).required(),
    role: Joi.string().required(),
    is_active: Joi.boolean().required()
});

const insertNewUser = async ({ org_code, first_name, last_name, email, password, role, is_active }: {
    org_code: string;
    first_name: string;
    last_name: string;
    email?: string | undefined;
    password?: string | undefined;
    role: string;
    is_active: boolean;
}) => {
    try {

        // const subQueryForUserId = String(`(
        //     SELECT 
        //       CASE 
        //         WHEN COUNT(*) = 0 
        //         THEN 'U_1'
        //         ELSE 'U_' || (COALESCE(
        //           MAX(CAST(SPLIT_PART(user_id, '_', 2) AS INTEGER)), 0) + 1)::TEXT
        //       END
        //     FROM 
        //     USERS
        //   )`)
        const { rows } = await pool.query(`
            INSERT INTO USERS 
                (org_code, first_name, last_name, email, password, role, is_active)
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7
            )
            RETURNING *
        `, [org_code, first_name, last_name, email, password, role, is_active,]);

        return { user: rows[0] };
    } catch (error: any) {
        console.log(error)
        return { error: error?.message };
    }
};

export const handleUserPOST = async (req: Request, res: Response) => {
    try {
        // ... handle POST logic start hear

        const org_code = req.auth?.user?.org_code as string;
        const { password, email, role, is_active, first_name, last_name }: userType & { password: string } = req.body;
        // if (!username || !password || !email) throw new Error('username,password,email and role is required');
        const { error: validationError } = schema.validate({ org_code, first_name, last_name, password, email, role, is_active });
        if (validationError) {
            throw new Error(validationError.details[0].message)
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err: any, hash: any) => {
            // Store hash in your password DB.
            if (err) throw new Error(err.message);

            console.log('ues pass validation');

            const { user: newUser, error: insertERror } = await insertNewUser({
                email,
                is_active,
                org_code,
                password: hash,
                role,
                first_name,
                last_name,
            });
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
                    message: insertERror
                });
            }
        });

    } catch (error) {
        // console.log({ error })
        return ResponseHandler(res, {
            resType: 'error',
            status: 'INTERNAL_SERVER_ERROR',
            message: (error as any)?.message || ''  //your can any message 
        });
    }
}
