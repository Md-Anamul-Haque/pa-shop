
import { type Request, type Response } from 'express'
import { handleLoginPOST } from './handleLoginPost'

const getRequest = async (req: Request, res: Response) => {
  res.send('hello')
}

export const GET = getRequest
export const POST = handleLoginPOST
