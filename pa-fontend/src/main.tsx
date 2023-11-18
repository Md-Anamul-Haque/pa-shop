import axios from 'axios'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import App from './App.tsx'
import './index.css'
import { Providers } from './lib/providers.tsx'
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
    <ToastContainer />
  </Providers>,
)
