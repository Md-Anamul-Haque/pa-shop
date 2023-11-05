// import * as fcs from '@/app/abc/route';
import express, { NextFunction, Request, Response } from 'express';
import { rg } from 'rg-express';
import { ResponseHandler } from './helpers/ResponseHandler';
// import router from './api/_router';

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

if ('development' === process.env.NODE_ENV) {
        const routerGenerators = new rg(app, { startDirName: 'src/api' })
        routerGenerators.runDevBuilder()
        routerGenerators.runStudio()
        routerGenerators.init()
} else {
        (async () => {
                const router = await import('./api/_router')
                app.use(router.default);

                //--------------- app route not found error-----------------------
                app.use((req: Request, res: Response, next: NextFunction) => {
                        return ResponseHandler(res, {
                                resType: 'error',
                                status: 'NOT_FOUND',
                                message: "route not found"
                        })
                })
                //-----------------app server error----------------------
                app.use((err: any, req: Request, res: Response, next: NextFunction) => {
                        return ResponseHandler(res, {
                                status: 'INTERNAL_SERVER_ERROR',
                                message: 'APP INTERNAL SERVER ERROR'
                        })
                });
        })()
}



export default app

