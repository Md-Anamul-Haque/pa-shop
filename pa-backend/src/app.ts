import cookieParser from 'cookie-parser';
import express from 'express';
import strftime from 'strftime';

import { NextFunction, Request, Response } from 'express';
import rg from 'rg-express';
import { ResponseHandler } from './helpers/ResponseHandler';

const app = express();
app.locals.title = 'pa-shop';
app.locals.strftime = strftime;
app.locals.email = 'm.anamul.personal@gmail.com';

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/ip', (req, res) => {
        res.send({
                ip: req.ip,
                routes: app._router[0]
        });
        console.log(req.ip)
});
// dynamic routes 
app.use(rg.routes(__dirname))
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
export default app