function addDecimals(num) {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export const updateCart = (state) => {
    if (state.cartItems.length !== 0) {
        state.itemsPrice = addDecimals(state.cartItems.reduce(function (acc, item) {
            return (acc + item.price * item.quantity);
        }, 0));

        state.shippingPrice =  state.discount ? 0 : Number(Math.round(state.itemsPrice > 100 ? 0 : 10).toFixed(2));

        const taxableAmount = state.itemsPrice + state.shippingPrice;

        state.taxPrice = addDecimals(Number((0.0825 * taxableAmount).toFixed(2)));

        state.totalPrice = addDecimals(Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice));
    } else {
        state.itemsPrice = 0;
        state.shippingPrice = 0;
        state.taxPrice = 0;
        state.totalPrice = 0;
    }
    localStorage.setItem("cart", JSON.stringify(state));
}
