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
import {HelmetProvider} from "react-helmet-async";
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
import SearchPage from "./pages/SearchPage";
import PaymentPage from "./pages/PaymentPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import AdminRoute from "./components/AdminRoute";
import AdminOrderListPage from "./pages/AdminOrderListPage";
import AdminProductListPage from "./pages/AdminProductListPage";
import AdminCreateProductPage from "./pages/AdminCreateProductPage";
import AdminUserListPage from "./pages/AdminUserListPage";
import NotFoundPage from "./pages/NotFoundPage";
import CategoryPage from "./pages/CategoryPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={"/"} element={<App/>}>

            {/*Public Routes*/}
            <Route index={true} path={"/"} element={<HomePage/>}/>
            <Route path={"/page/:pageNumber"} element={<HomePage/>}/>
            <Route path={"/search/:searchTerm"} element={<SearchPage/>}/>
            <Route path={"/search/:searchTerm/page/:pageNumber"} element={<SearchPage/>}/>
            <Route path={"/sort/:sortByTerm/select/:filterTerm"} element={<CategoryPage/>}/>
            <Route path={"/sort/:sortByTerm/select/:filterTerm/page/:pageNumber"} element={<CategoryPage/>}/>
            <Route path={"/product/:id"} element={<ProductPage/>}/>
            <Route path={"/cart"} element={<CartPage/>}/>
            <Route path={"/login"} element={<LoginPage/>}/>
            <Route path={"/register"} element={<RegisterPage/>}/>
            <Route path={"/reset-password/:id/:token"} element={<ForgotPasswordPage/>}/>
            <Route path={"/notfound"} element={<NotFoundPage/>}/>
            <Route path={"/*"} element={<NotFoundPage/>}/>

            {/*Private Routes*/}
            <Route path={""} element={<PrivateRoute/>}>
                <Route path={"/shipping"} element={<ShippingPage/>}/>
                <Route path={"/payment"} element={<PaymentPage/>}/>
                <Route path={"/submitorder"} element={<CheckoutPage/>}/>
                <Route path={"/order/:id"} element={<OrderPage/>}/>
                <Route path={"/profile/:id"} element={<ProfilePage/>}/>
            </Route>

            <Route path={""} element={<AdminRoute/>}>
                <Route path={"/admin/orders"} element={<AdminOrderListPage/>}/>
                <Route path={"/admin/products/sort/:sortByTerm/select/:filterTerm"} element={<AdminProductListPage/>}/>
                <Route path={"/admin/products/sort/:sortByTerm/select/:filterTerm/page/:pageNumber"} element={<AdminProductListPage/>}/>
                <Route path={"/admin/products/create"} element={<AdminCreateProductPage/>}/>
                <Route path={"/admin/users"} element={<AdminUserListPage/>}/>
            </Route>
        </Route>
    )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <HelmetProvider>
          {/*REDUX TOOLKIT PROVIDER*/}
          <Provider store={store}>
              {/*PAYPAL PROVIDER*/}
              <PayPalScriptProvider deferLoading={true}>
                  <RouterProvider router={router} />
              </PayPalScriptProvider>
          </Provider>
      </HelmetProvider>
  </React.StrictMode>
);
