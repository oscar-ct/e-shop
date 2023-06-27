import {createSlice} from "@reduxjs/toolkit";


const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {cartItems: []}

const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addToCart: function (state, action) {
         const item = action.payload;
         const existItem = state.cartItems.find(function (cartItem) {
            return item._id === cartItem._id;
         })
         if (existItem) {
            state.cartItems = state.cartItems.map(function (cartItem) {
               if (cartItem._id === existItem._id) {
                  return item;
               } else {
                  return cartItem;
               }
            })
         } else {
            state.cartItems = [...state.cartItems, item];
         }
      }
   },
});

export default cartSlice.reducer;