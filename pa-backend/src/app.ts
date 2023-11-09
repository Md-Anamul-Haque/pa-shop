import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import { rg } from 'rg-express';
import strftime from 'strftime';
import { ResponseHandler } from './helpers/ResponseHandler';

import config from './config';
import { lazy_workers } from './helpers/lazy_workers';
const PORT = config.app.serverPort || 8001;

const app = express()
app.locals.title = 'pa-shop';
app.locals.strftime = strftime;
app.locals.email = 'nocrashsoft@gmail.com';

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const routerGenerators = new rg(app, { startDirName: 'src/api' })
app.get('/ip', (req, res) => {
        res.send({
                ip: req.ip,
                routes: app._router[0]
        })
});

(async () => {
        if ('development' === process.env.NODE_ENV) {
                await routerGenerators.runDevBuilder()
                await routerGenerators.init()
                await routerGenerators.runStudio()
        } else {
                const router = await import('./api/_router')
                app.use(router?.default);
        }

        //--------------- app route not found error-----------------------
        app.use((req: Request, res: Response, next: NextFunction) => {
                return ResponseHandler(res, {
                        resType: 'error',
                        status: 'NOT_FOUND',
                        message: "route not found"
                });
        });
        //-----------------app server error----------------------
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
                return ResponseHandler(res, {
                        status: 'INTERNAL_SERVER_ERROR',
                        message: 'APP INTERNAL SERVER ERROR'
                });
        });
        app.listen(PORT, () => {
                console.log(`\x1b[32mServer is running at http://localhost:${PORT}\x1b[0m`);
                lazy_workers()
        });
})();