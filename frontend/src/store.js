import {configureStore} from "@reduxjs/toolkit";
import {apiSlice} from "./slices/apiSlice";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";
import loadingSliceReducer from "./slices/loadingSlice";
import orderSliceReducer from "./slices/orderSlice";

const store = configureStore({
   reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      cart: cartSliceReducer,
      auth: authSliceReducer,
      loading: loadingSliceReducer,
      order: orderSliceReducer,

   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
   devTools: true,
});

export default store;