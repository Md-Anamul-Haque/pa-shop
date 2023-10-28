// import * as fcs from '@/app/abc/route';
import express from 'express';
import { rg } from 'rg-express';
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
                app.use(router.default)
        })()
}
// app.use(router)
export default app

