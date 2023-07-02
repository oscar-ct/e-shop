import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from 'react-router-dom'
import {Provider} from "react-redux";
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
            </Route>

        </Route>
    )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      {/*REDUX TOOLKIT PROVIDER*/}
      <Provider store={store}>
            <RouterProvider router={router} />
      </Provider>
  </React.StrictMode>
);
