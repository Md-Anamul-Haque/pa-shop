
import { auth } from '@/helpers/auth'
import { handleProductGETOne } from './handleGetOne'
import { handleProductPUT } from './handleUpdate'

export const GET = [auth, handleProductGETOne]
// export const DELETE = [auth, auth.isAdmin, handleProductDELETE]
export const PUT = [auth, handleProductPUT]
