import {createSlice} from "@reduxjs/toolkit";
import {updateCart} from "../utils/cartUtils";


const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {cartItems: [], shippingAddress: {}, paymentMethod: "PayPal"};

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
         // updating all cart prices incl. tax, shipping, and qty from cartUtils
         return updateCart(state);
      },
      removeFromCart: function (state, action) {
         state.cartItems = state.cartItems.filter(function (item) {
            return item._id !== action.payload
         });
         return updateCart(state);
      },
      saveShippingAddress: function (state, action) {
         state.shippingAddress = action.payload;
         return updateCart(state);
      }
   },
});

export const { addToCart, removeFromCart, saveShippingAddress} = cartSlice.actions;

export default cartSlice.reducer;