
import { auth } from '@/helpers/auth'
import { handlePurchaseGET } from './handleGET'
import { handlePurchasePUT } from './handlePut'


export const GET = [auth, handlePurchaseGET]
export const PUT = [auth, handlePurchasePUT]
