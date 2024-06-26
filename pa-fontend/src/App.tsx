import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Customers from "./pages/Customer/Customer.tsx";
import Home from "./pages/Home/Home.tsx";
import Layout from "./pages/Layout.tsx";
import Login from "./pages/Login/Login.tsx";
import Products from "./pages/Product/Product.tsx";
import Product from "./pages/Product/[prod_id]/page.tsx";
import Purchase from "./pages/Purchase/Purchase.tsx";
import PurchaseList from "./pages/Purchase/list/PurchaseList.tsx";
import Sales from "./pages/Sells/Sells.tsx";
import Suppliers from "./pages/Supplier/Supplier.tsx";
import Users from "./pages/User/User.tsx";
import PurchaseEdit from "./pages/Purchase/edit/PurchaseEdit.tsx";
import SaleEdit from "./pages/Sells/edit/SellsEdit.tsx";
import PurchaseReturnPage from "./pages/Purchase/return/PurchaseReturn.tsx";
import SalesReturnPage from "./pages/Sells/return/SaleReturn.tsx";
import SalesList from "./pages/Sells/list/SalesList.tsx";
const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:prod_id",
        element: <Product />,
      },
      {
        path: "supplier",
        element: <Suppliers />,
      },
      {
        path: "customer",
        element: <Customers />,
      },
      {
        path: "user",
        element: <Users />,
      },
      {
        path: "purchase",
        element: <Purchase />,
      },
      {
        path: "purchase/list",
        element: <PurchaseList />,
      },
      {
        path: "purchase/:pur_id",
        element: <PurchaseEdit />,
      },
      {
        path: 'purchase/return',
        element: <PurchaseReturnPage />
      },
      {
        path: "sales",
        element: <Sales />,
      },
      {
        path: "sales/return",
        element: <SalesReturnPage />
      },
      {
        path: "sales/list",
        element: <SalesList />
      },
      {
        path: "sales/:sales_id",
        element: <SaleEdit />
      }
    ],
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
