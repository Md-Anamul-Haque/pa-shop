
import { NextFunction, Request, Response } from 'express';
import { ResponseHandler } from './helpers/ResponseHandler';

import { rg } from 'rg-express';
import app from './app';
import config from './config';
import { lazy_workers } from './helpers/lazy_workers';
const PORT = config.app.serverPort || 8001;

(async () => {
  if ('development' === process.env.NODE_ENV) {
    const routerGenerators = new rg({ startDir: './src/api/' });
    await routerGenerators.runDevBuilder();
    await routerGenerators.init(app);
    await routerGenerators.runStudio(app);
  } else {
    // const router = await import('./api/_router');
    // app.use(router?.default);
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
