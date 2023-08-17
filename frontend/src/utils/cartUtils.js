export const updateCart = (state) => {
    if (state.cartItems.length !== 0) {
        state.itemsPrice = state.cartItems.reduce(function (acc, item) {
            return acc + item.price * item.quantity;
        }, 0);

        state.shippingPrice =  state.discount ? 0 : Number(Math.round(state.itemsPrice > 100 ? 0 : 10).toFixed(2));

        state.taxPrice = Number((0.0825 * state.itemsPrice).toFixed(2));

        state.totalPrice = (Number(Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)).toFixed(2));
    } else {
        state.itemsPrice = 0;
        state.shippingPrice = 0;
        state.taxPrice = 0;
        state.totalPrice = 0;
    }
    localStorage.setItem("cart", JSON.stringify(state));
}

// const addDecimals = (int) => {
//    return (Math.round(int * 100) / 100).toFixed(2);
// }