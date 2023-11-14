// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom';
import './App.css';
import NotFound from './NotFound';
import Home from './pages/Home/Home';
import Products from './pages/Product/Product';
import Product from './pages/Product/[prod_id]/page';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='product' element={<Products />} />
        <Route path='product/:prod_id' element={<Product />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
