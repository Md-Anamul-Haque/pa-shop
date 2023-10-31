
import { auth } from '@/helpers/auth'
import { type Request, type Response } from 'express'
import { handlePurchasePOST } from './handlePOST'

const getRequest = async (req: Request, res: Response) => {
  res.send('hello')
}

export const GET = getRequest
export const POST = [auth, handlePurchasePOST]
