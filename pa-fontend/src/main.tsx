import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Providers } from './lib/providers.tsx'
// const router = createBrowserRouter([
//   {
//     path: "login",
//     element: <Login />,
//   },
//   {
//     path: "*",
//     element: <App />,
//   },
// ]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Providers>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} /> {/* 👈 Renders at /app/ */}
      </Routes>
    </BrowserRouter>
  </Providers>,
)
