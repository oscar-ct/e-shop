import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

const CheckoutSteps = () => {

    const {shippingAddress, paymentMethod} = useSelector(function (state) {
       return state.cart;
    });

    const {pathname} = useLocation();

    const step1name = "Cart"
    const step2name = "Shipping"
    const step3name = "Payment"
    const step4name = "Checkout";

    const isCartPage = pathname.includes(step1name.toLowerCase());
    const isShippingPage = pathname.includes(step2name.toLowerCase());
    const isPaymentPage = pathname.includes(step3name.toLowerCase());
    const isPlaceOrderPage = pathname.includes("submitorder");

    return (
        <div className={"flex justify-center pt-5 text-xs sm:text-sm font-semibold"}>
                    <div className={"steps w-full roboto"}>
                        <Link to={"/cart"} data-content="✓" className={`step step-success ${isCartPage ? "text-lg sm:text-xl" : "text-gray-400"}`}>
                            {step1name}
                        </Link>
                        {
                            Object.keys(shippingAddress).length !== 0 ? (
                                <Link data-content="✓" to={"/shipping"} className={`step step-success ${isShippingPage ? "text-lg sm:text-xl" : "text-gray-400"}`}>
                                    {step2name}
                                </Link>
                            ) : (
                                <Link data-content="✕" to={"/shipping"} className={`step ${isShippingPage ? "text-lg sm:text-xl" : "text-gray-400"}`}>
                                    {step2name}
                                </Link>
                            )
                        }
                        {
                            paymentMethod ? (
                                <Link data-content="✓" to={"/payment"} className={`step step-success ${isPaymentPage ? "text-lg sm:text-xl" : "text-gray-400"}`}>
                                    {step3name}
                                </Link>
                            ) : (
                                <button data-content="✕" className={`step ${isPaymentPage ? "text-lg sm:text-xl" : "text-gray-400"}`}>
                                    {step3name}
                                </button>
                            )
                        }
                        {
                            Object.keys(shippingAddress).length !== 0 && paymentMethod ? (
                                <Link data-content="✓" to={"/submitorder"} className={`step step-success ${isPlaceOrderPage ? "text-lg sm:text-xl" : "text-gray-400"}`}>
                                    {step4name}
                                </Link>
                            ) : (
                                <button data-content="✕" className={`step ${isPlaceOrderPage ? "text-lg sm:text-xl" : "text-gray-400"}`}>
                                    {step4name}
                                </button>
                            )
                        }

                    </div>
        </div>
    );
};

export default CheckoutSteps;