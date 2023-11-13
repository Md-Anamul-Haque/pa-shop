
import { auth } from '@/helpers/auth'
import { handleCustomerGETOne } from './handleGETOne'
import { handleCustomerPUT } from './handlePUT'


export const GET = [auth, handleCustomerGETOne]
export const PUT = [auth, handleCustomerPUT]
