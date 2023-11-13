
import { auth } from '@/helpers/auth'
import { handleProductGET } from './handleGET'
import { handleProductPOST } from './handlePOST'


export const GET = [auth, handleProductGET]
export const POST = [auth, handleProductPOST]
