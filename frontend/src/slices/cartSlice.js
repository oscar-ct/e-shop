import {createSlice} from "@reduxjs/toolkit";

// const addDecimals = (int) => {
//    return (Math.round(int * 100) / 100).toFixed(2);
// }

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



         state.itemsPrice = state.cartItems.reduce(function (acc, item) {
            return acc + item.price * item.quantity;
         }, 0);

         state.shippingPrice = Number(Math.round(state.itemsPrice > 100 ? 0 : 10).toFixed(2));

         state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));

         state.totalPrice = (
            Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)
         );

         localStorage.setItem("cart", JSON.stringify(state));
      }
   },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;