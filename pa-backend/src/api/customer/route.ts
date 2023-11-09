
import { auth } from '@/helpers/auth'
import { handleCustomerGET } from './handleGET'
import { handleCustomerPOST } from './handlePOST'


export const GET = [auth, handleCustomerGET]
export const POST = [auth, handleCustomerPOST]