
import { auth } from '@/helpers/auth'
import { handleUserGET } from './handleGET'
import { handleUserPOST } from './handlePOST'


export const GET = [auth, handleUserGET]
export const POST = [auth, auth.isAdmin, handleUserPOST]
