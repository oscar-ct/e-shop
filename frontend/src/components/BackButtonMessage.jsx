import {useSelector} from "react-redux";
import Message from "./Message";

const BackButtonMessage = ({width = ""}) => {

    const cart = useSelector(function (state) {
        return state.cart;
    });

    return (
        <div className={`absolute right-0 pl-2 pr-3 pt-3 ${width}`}>
            {
                cart.cartItems.length === 0 && (
                    <Message variant={"info"} border={"h-12"}>
                        <span className={"text-xs sm:text-sm"}>FREE shipping on qualifying orders over $100.</span>
                    </Message>
                )
            }
            {
                cart.cartItems.length !== 0 && cart.itemsPrice < 100 && (
                    <Message variant={"info"} border={"h-12"}>
                        <span className={"text-xs sm:text-sm"}>Add <span className={"font-bold"}>${(100 - cart.itemsPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.</span>
                    </Message>
                )
            }
            {
                cart.cartItems.length !== 0 && cart.itemsPrice >= 100 && (
                    <Message variant={"success"} border={"h-12"}>
                        <span className={"text-xs sm:text-sm"}>Congratulations! Your order qualifies for FREE shipping.</span>
                    </Message>
                )
            }
        </div>
    );
};

export default BackButtonMessage;