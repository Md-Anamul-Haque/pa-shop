
import { type Request, type Response } from 'express'

const haneleGetTmp_a = async (req: Request, res: Response) => {
    res.send('Tmp/a a')
}

export const GET = [haneleGetTmp_a]
