import { ThemeProvider } from '@/lib/nn-themes'
import axios from 'axios'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import App from './App.tsx'
import './index.css'
import { Providers } from './lib/providers.tsx'
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme='system' attribute="class" enableSystem>
    <Providers>
      <App />
      <ToastContainer />
    </Providers>
  </ThemeProvider>,
)
