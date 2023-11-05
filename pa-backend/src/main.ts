import app from './app';
import config from './config';
const PORT = config.app.serverPort || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
