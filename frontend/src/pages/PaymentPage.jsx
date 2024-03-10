import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {savePaymentMethod} from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import {ReactComponent as PayPal} from "../icons/paypal-icon.svg";
import Meta from "../components/Meta";
import CustomBtn from "../components/CustomBtn";


const PaymentPage = () => {

    const cartItems = useSelector(function (state) {
        return state.cart;
    });
    const {shippingAddress, paymentMethod} = cartItems;
    const [paymentMeth, setPaymentMeth] = useState(paymentMethod ? paymentMethod : null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const shippingAddressIsInvalid = Object.keys(shippingAddress).length === 0;

    useEffect(function (){

        if (cartItems.cartItems.length === 0) {
            navigate("/")
        } else if (shippingAddressIsInvalid) {
            navigate("/shipping");
        }
    }, [navigate, shippingAddress, cartItems.cartItems.length, shippingAddressIsInvalid])

    const submitPaymentMethod = (e) => {
        e.preventDefault();
        if (paymentMeth) {
            dispatch(savePaymentMethod(paymentMeth));
            navigate("/submitorder")
        }

    }
    return (
        <>
            <Meta title={"Payment Method"}/>
            <CheckoutSteps/>
            <div className={"pt-0 w-full flex justify-center"}>
                <div className={"mb-10 pt-3 sm:pt-7 w-full sm:w-[35em]"}>
                    <div className={"hidden md:block py-2 text-center text-3xl md:text-2xl font-semibold ibmplex bg-white md:bg-neutral md:text-white"}>
                        <h1>Payment Method(s)</h1>
                    </div>
                    <div className={"px-10 pb-10 pt-5 border"}>
                        <form onSubmit={submitPaymentMethod}>
                            <div className="my-5">
                                <div
                                    className={"w-full card bg-zinc-100 cursor-pointer"}
                                    onClick={() => setPaymentMeth("PayPal / Credit Card")}
                                >
                                    <div className={"w-full flex p-6"}>
                                        <div className={"w-2/12"}>
                                          <PayPal width={"30"} height={"38"}/>
                                        </div>
                                        <div className={"w-8/12 flex  items-center"}>
                                            <span className={"text-lg"}>
                                                PayPal / Credit Card
                                            </span>
                                        </div>
                                        <div className={"w-2/12 flex items-center"}>
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
                            <div className={"pt-5 w-full flex justify-end"}>
                                <CustomBtn isDisabled={paymentMeth === null} type={"submit"}>
                                    Proceed To Checkout
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