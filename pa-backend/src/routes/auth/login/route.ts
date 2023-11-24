
import { auth } from '@/helpers/auth'
import { handleMeGET } from '../me/handleMeGET'
import { handleLoginPOST } from './handleLoginPost'


export const GET = [auth, handleMeGET]
export const POST = handleLoginPOST
