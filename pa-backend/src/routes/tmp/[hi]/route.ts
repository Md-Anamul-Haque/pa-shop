
import { type Request, type Response } from 'express'

const haneleGetTmpHi = async (req: Request, res: Response) => {
    res.send('TmpHi')
}

export const GET = haneleGetTmpHi
