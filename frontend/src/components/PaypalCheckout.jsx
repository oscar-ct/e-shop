import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {
    useGetPayPalClientIdQuery,
    usePayOrderMutation,
    useVerifyAmountMutation
} from "../slices/ordersApiSlice";
import {useValidateDiscountCodeMutation} from "../slices/productsApiSlice";
import {useEffect} from "react";
import {toast} from "react-hot-toast";
import {removeDiscountCode} from "../slices/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const PaypalCheckout = ({createNewOrder, existingOrder, refetch}) => {

    const cartState = useSelector( (state) => state.cart);
    const { discountKey, cartItems, totalPrice} = cartState;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    const [payOrder] = usePayOrderMutation();
    const [validateDiscountCode] = useValidateDiscountCodeMutation();
    const [verifyAmount] = useVerifyAmountMutation();

    const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery();

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD",
                        enableFunding: "venmo"
                    }
                });
                paypalDispatch({type: "setLoadingStatus", value: "pending"});
            }
            if (!window.paypal) {
                loadPayPalScript();
            }
        }
    }, [paypal, paypalDispatch, loadingPayPal, errorPayPal]);


    /// Paypal Actions ////
    const paypalPaymentIntent = async (data, actions) => {
            let isDiscounted;
            if (!existingOrder) {
                const discount = await validateDiscountCode({code: discountKey}).unwrap();
                if (discount) {
                    isDiscounted = discount.validCode
                }
            }
            let totalPriceFromBackend = await verifyAmount({
                orderItems: existingOrder ? existingOrder.orderItems : cartItems,
                validCode: existingOrder ? existingOrder.freeShipping : isDiscounted
            }).unwrap();
            totalPriceFromBackend = Number(totalPriceFromBackend);
            if (!existingOrder) {
                if (totalPriceFromBackend !== Number(totalPrice)) {
                    toast.error("Something went wrong, please try again later.");
                    return;
                }
            } else {
                if (totalPriceFromBackend !== existingOrder.totalPrice) {
                    toast.error("Something went wrong, please try again later.");
                    return;
                }
            }
            return await actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: totalPriceFromBackend.toFixed(2),
                        }
                    }
                ]
            });

    };
    const onPaypalApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {
            if (!existingOrder) {
                const orderId = await createNewOrder();
                if (orderId) {
                    await payOrder({orderId: orderId, details});
                    navigate(`/order/${orderId}/payment?paypal=successful`);
                    dispatch(removeDiscountCode());
                }
            } else {
                await payOrder({orderId: existingOrder._id, details});
            }
            refetch();
        });
    };
    const onPaypalError = (error) => {
        toast.error(error.message);
        console.log(error || error.data.message);
    };

    return (
        !isPending && (
            <PayPalButtons
                forceReRender={[totalPrice]}
                createOrder={paypalPaymentIntent}
                onApprove={onPaypalApprove}
                onError={onPaypalError}
                style={{shape: "pill", height: 40}}
            >
            </PayPalButtons>
        )
    );
};

export default PaypalCheckout;