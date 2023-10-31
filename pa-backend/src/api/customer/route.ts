
import { type Request, type Response } from 'express'

const getRequest = async (req: Request, res: Response) => {
  res.send('hello')
}

export const GET = getRequest
