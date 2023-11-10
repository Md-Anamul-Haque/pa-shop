import cookieParser from 'cookie-parser';
import express from 'express';
import strftime from 'strftime';
console.log('running app.ts')

const app = express();
app.locals.title = 'pa-shop';
app.locals.strftime = strftime;
app.locals.email = 'nocrashsoft@gmail.com';

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/ip', (req, res) => {
        res.send({
                ip: req.ip,
                routes: app._router[0]
        })
});

export default app