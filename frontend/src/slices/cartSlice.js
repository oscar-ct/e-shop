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
         const itemUserIsAddingToCart = action.payload;

         // each item has unique id, if the item the user is trying to add to cart already exist in the cart, this will return true and an object of the existing item.
         const existItem = state.cartItems.find(function (cartItem) {
            return itemUserIsAddingToCart._id === cartItem._id;
         });

         // if true/exists, we loop through and update or add the existing item in the cart
         if (existItem) {
            state.cartItems = state.cartItems.map(function (cartItem) {
               // we locate the item with matching ids and update the old item in the cart with the new item quantity
               if (cartItem._id === existItem._id) {
                  return itemUserIsAddingToCart;
               // we return the items that the user has stored in their cart without any changes
               } else {
                  return cartItem;
               }
            });
            // we add the item the user is adding to cart because the item did not exist in the cart
         } else {
            state.cartItems = [...state.cartItems, itemUserIsAddingToCart];
         }


         // set sum of items price
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