
import { auth } from '@/helpers/auth'
import { handlePurchaseGET } from './handleGet'
import { handlePurchasePOST } from './handlePOST'


export const GET = [auth, handlePurchaseGET]
export const POST = [auth, handlePurchasePOST]
