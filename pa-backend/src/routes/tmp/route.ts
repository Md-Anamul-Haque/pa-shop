
import { type Request, type Response } from 'express'

const haneleGetTmp = async (req: Request, res: Response) => {
  res.send('Tmp')
}

export const GET = haneleGetTmp
