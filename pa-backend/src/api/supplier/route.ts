
import { auth } from '@/helpers/auth'
import { handleSupplierGET } from './handleGET'
import { handleSupplierPOST } from './handlePost'

export const GET = [auth, handleSupplierGET]
export const POST = [auth, handleSupplierPOST]
