import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from 'react-router-dom'
import {Provider} from "react-redux";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import store from "./store";
import './index.css';
import App from './App';
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/ShippingPage";
import PrivateRoute from "./components/PrivateRoute";
import PaymentPage from "./pages/PaymentPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import AdminRoute from "./components/AdminRoute";
import AdminOrderListPage from "./pages/AdminOrderListPage";
import AdminProductListPage from "./pages/AdminProductListPage";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={"/"} element={<App/>}>

            {/*Public Routes*/}
            <Route index={true} path={"/"} element={<HomePage/>}/>
            <Route path={"/product/:id"} element={<ProductPage/>}/>
            <Route path={"/cart"} element={<CartPage/>}/>
            <Route path={"/login"} element={<LoginPage/>}/>
            <Route path={"/register"} element={<RegisterPage/>}/>

            {/*Private Routes*/}
            <Route path={""} element={<PrivateRoute/>}>
                <Route path={"/shipping"} element={<ShippingPage/>}/>
                <Route path={"/payment"} element={<PaymentPage/>}/>
                <Route path={"/checkout"} element={<CheckoutPage/>}/>
                <Route path={"/order/:id"} element={<OrderPage/>}/>
                <Route path={"/profile/:id"} element={<ProfilePage/>}/>
            </Route>

            <Route path={""} element={<AdminRoute/>}>
                <Route path={"/admin/orders"} element={<AdminOrderListPage/>}/>
                <Route path={"/admin/products"} element={<AdminProductListPage/>}/>
            </Route>
        </Route>
    )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      {/*REDUX TOOLKIT PROVIDER*/}
      <Provider store={store}>
          {/*PAYPAL PROVIDER*/}
          <PayPalScriptProvider deferLoading={true}>
              <RouterProvider router={router} />
          </PayPalScriptProvider>
      </Provider>
  </React.StrictMode>
);
