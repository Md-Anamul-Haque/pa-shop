
import app from './app';
import config from './config';
import { pool } from './config/db';
import { lazy_workers } from './helpers/lazy_workers';
const PORT = config.app.serverPort || 8001;

app.listen(PORT,async () => {
  console.log(`\x1b[32mServer is running at http://localhost:${PORT}\x1b[0m`);
  lazy_workers()


});

