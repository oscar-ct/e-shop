function addDecimals(num) {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export function calculatePrices(orderItems, validCode) {
    const itemsPrice = addDecimals(orderItems.reduce((acc, item) => {
            return acc + item.price * item.quantity
    }, 0));

    const shippingPrice =  validCode ? 0 : Number(Math.round(itemsPrice > 100 ? 0 : 10).toFixed(2));

    const taxableAmount = itemsPrice + shippingPrice;

    const taxPrice = addDecimals(Number((0.0825 * taxableAmount).toFixed(2)));

    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}




