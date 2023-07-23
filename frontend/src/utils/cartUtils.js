export const updateCart = (state) => {
    if (state.cartItems.length !== 0) {
        state.itemsPrice = state.cartItems.reduce(function (acc, item) {
            return acc + item.price * item.quantity;
        }, 0);

        state.shippingPrice = Number(Math.round(state.itemsPrice > 100 ? 0 : 10).toFixed(2));

        state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));

        state.totalPrice = (Number(Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)).toFixed(2));
    }
    localStorage.setItem("cart", JSON.stringify(state));
}

// const addDecimals = (int) => {
//    return (Math.round(int * 100) / 100).toFixed(2);
// }