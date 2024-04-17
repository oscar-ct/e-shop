import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {savePaymentMethod} from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import {ReactComponent as PayPal} from "../icons/paypal-logo.svg";
import {ReactComponent as StripeLogo} from "../icons/stripe-logo.svg";
import Meta from "../components/Meta";
import CustomBtn from "../components/CustomBtn";

const PaymentPage = () => {

    const {shippingAddress, paymentMethod, cartItems} = useSelector(function (state) {
        return state.cart;
    });
    const [paymentMeth, setPaymentMeth] = useState(paymentMethod ? paymentMethod : null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(function (){
        const shippingAddressIsInvalid = Object.keys(shippingAddress).length === 0;
        if (cartItems.length === 0) {
            navigate("/")
        } else if (shippingAddressIsInvalid) {
            navigate("/shipping");
        }
    }, [navigate, shippingAddress, cartItems.length]);

    const submitPaymentMethod = (e) => {
        e.preventDefault();
        if (paymentMeth) {
            dispatch(savePaymentMethod(paymentMeth));
            navigate("/submitorder")
        }
    };

    return (
        <>
            <Meta title={"Payment Method"}/>
            <CheckoutSteps/>
            <div className={"pt-0 w-full flex justify-center"}>
                <div className={"pt-3 sm:pt-7 w-full sm:w-[35em]"}>
                    <div className={"hidden md:block py-2 text-center text-3xl md:text-2xl font-semibold ibmplex bg-white md:bg-zinc-700 md:text-white"}>
                        <h1>Select your preferred Payment Service</h1>
                    </div>
                    <h1 className={"md:hidden pt-7 text-center font-semibold text-3xl bg-white px-2"}>
                        Select your preferred Payment Service
                    </h1>
                    <div className={"md:shadow-lg bg-white px-10 pb-5 pt-5 md:border text-sm"}>
                        <form onSubmit={submitPaymentMethod}>
                            <div className="my-5">
                                <div
                                    className={`w-full border cursor-pointer rounded-md shadow-sm ${paymentMeth === "PayPal / Credit Card" && "ring-2 border-green-500 ring-green-100"}`}
                                    onClick={() => setPaymentMeth("PayPal / Credit Card")}
                                >
                                    <div className={"w-full flex px-6 py-5"}>
                                        <div className={"w-2/12 flex justify-center"}>
                                          <PayPal width={"50"} height={"50"}/>
                                        </div>
                                        <div className={"w-9/12 flex items-center"}>
                                             <span className={"px-3"}>
                                                PayPal, Venmo, and Credit Card.
                                            </span>
                                        </div>
                                        <div className={"w-1/12 flex items-center"}>
                                            <input
                                                onChange={(e) => setPaymentMeth(e.target.value)}
                                                type="radio"
                                                name="paymentMethod"
                                                id={"PayPal / Credit Card"}
                                                value={"PayPal / Credit Card"}
                                                className="radio radio-primary"
                                                checked={paymentMeth === "PayPal / Credit Card"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="my-5">
                                <div
                                    className={`w-full border cursor-pointer rounded-md shadow-sm ${paymentMeth === "Stripe / Credit Card" && "ring-2 border-green-500 ring-green-100"}`}
                                    onClick={() => setPaymentMeth("Stripe / Credit Card")}
                                >
                                    <div className={"w-full flex pr-6 pl-3 py-5"}>
                                        <div className={"w-2/12 flex justify-center"}>
                                            <StripeLogo className={"w-full h-full"}/>
                                        </div>
                                        <div className={"w-9/12 flex items-center"}>
                                            <span className={"px-3 py-4"}>
                                               Credit Card, Cash App, After Pay, and more.
                                            </span>
                                        </div>
                                        <div className={"w-1/12 flex items-center"}>
                                            <input
                                                onChange={(e) => setPaymentMeth(e.target.value)}
                                                type="radio"
                                                name="paymentMethod"
                                                id={"Stripe / Credit Card"}
                                                value={"Stripe / Credit Card"}
                                                className="radio radio-primary"
                                                checked={paymentMeth === "Stripe / Credit Card"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"pt-5 w-full flex justify-end"}>
                                <CustomBtn isDisabled={paymentMeth === null} type={"submit"}>
                                    Save and Continue
                                </CustomBtn>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentPage;