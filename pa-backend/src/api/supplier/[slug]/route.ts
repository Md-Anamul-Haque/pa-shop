
import { auth } from '@/helpers/auth'
import { type Request, type Response } from 'express'
import { handleSupplierGETOne } from './handleGETOne'
import { handleSupplierPUT } from './handlePUT'

const getRequest = async (req: Request, res: Response) => {
    res.send('hello')
}

export const GET = [auth, handleSupplierGETOne]
export const PUT = [auth, handleSupplierPUT]
