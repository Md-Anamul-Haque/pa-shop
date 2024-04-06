
import { type Request, type Response } from 'express'

const haneleGetTmp_ = async (req: Request, res: Response) => {
    res.send('Tmp/[...ids]:' + req.params.ids)
}

export const GET = [haneleGetTmp_]
