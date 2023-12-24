
import { auth } from '@/helpers/auth'
import { handleSaleschaseGET } from './handleGET'
import { handlePurchasePUT } from './handlePut'


export const GET = [auth, handleSaleschaseGET]
export const PUT = [auth, handlePurchasePUT]
