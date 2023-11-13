
import { auth } from '@/helpers/auth'
import { handleSalesGET } from './handleGet'
import { handleSalesPOST } from './handlePost'

export const GET = [auth, handleSalesGET]
export const POST = [auth, handleSalesPOST]