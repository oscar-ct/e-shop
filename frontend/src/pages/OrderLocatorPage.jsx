import {useState} from 'react';
import {useVerifyEmailMutation} from "../slices/usersApiSlice";
import {useVerifyOrderMutation} from "../slices/ordersApiSlice";
import {useDispatch} from "react-redux";
import {setLoading} from "../slices/loadingSlice";
import {useNavigate} from "react-router-dom";
import CustomBtn from "../components/CustomBtn";

const OrderLocatorPage = () => {

    const navigate = useNavigate();
    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
    const [email, setEmail] = useState("");
    const [order, setOrder] = useState("");
    const [orderErrorMessage, setOrderErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [verifyEmail] = useVerifyEmailMutation();
    const [verifyOrder] = useVerifyOrderMutation();
    const [emailInputIsFocused, setEmailInputIsFocused] = useState(false);
    const [orderInputIsFocused, setOrderInputIsFocused] = useState(false);
    const dispatch = useDispatch();

    const verifyEmailHandler = async (e) => {
        e.preventDefault();
        setEmailErrorMessage("");
        dispatch(setLoading(true));
        const res = await verifyEmail({email: email}).unwrap();
        setTimeout(() => {
            if (res.isValidEmail) {
                setIsVerifiedEmail(true);
            } else {
                setEmailErrorMessage("Sorry, we couldn't find an order with this email, please try another email.");
            }
            dispatch(setLoading(false));
        }, 600);
    };

    const locateOrderHandler = async (e) => {
        e.preventDefault();
        setOrderErrorMessage("");
        const res = await verifyOrder({email: email, order: order}).unwrap();
        if (res.isValidOrder) {
            navigate(`/order/${order}`);
        } else {
            dispatch(setLoading(true));
            setTimeout(() => {
                setOrderErrorMessage("Sorry, we couldn't find this order, please try again.");
                dispatch(setLoading(false));
            }, 600);
        }
    };

    return (
        <div className={"min-h-[calc(100vh-292px)] md:min-h-[calc(100vh-224px)] flex justify-center items-center"}>
            <div className="bg-white p-6 sm:p-14 sm:border">
                <div className="text-start font-bold text-4xl">
                    Let&apos;s find your e-shop order
                </div>
                {
                    !isVerifiedEmail ? (
                        <form onSubmit={verifyEmailHandler}>
                            <p className="mx-auto font-normal text-sm my-6 max-w-lg">
                                Please enter your email address that you used to place your order.  We will need your order number in the next step.
                            </p>
                            <div className={`${emailInputIsFocused ? "ring-2 ring-blue-200 border-blue-400" : "border-gray-300"} flex items-center border bg-white shadow-sm rounded-md overflow-hidden px-2 h-14 justify-between`}>
                                <label className="text-sm font-medium text-gray-600 tracking-wide border-r border-gray-300 pr-2 h-full w-min flex items-center">Email
                                </label>
                                <input
                                    onFocus={() => setEmailInputIsFocused(true)}
                                    onBlur={() => setEmailInputIsFocused(false)}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white text-base text-gray-600 flex-grow outline-none px-2 "
                                    type="email"
                                    placeholder="Enter your email address"
                                    autoComplete={"email"}
                                    required
                                />
                                <div className="hidden sm:flex ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                    <CustomBtn type={"submit"}>
                                        Search
                                    </CustomBtn>
                                </div>
                            </div>
                            <div className="pt-3 flex sm:hidden justify-end items-center px-2 rounded-lg space-x-4 mx-auto ">
                                <CustomBtn type={"submit"}>
                                    Search
                                </CustomBtn>
                            </div>
                            {
                                emailErrorMessage && (
                                    <p className="text-center mx-auto font-normal text-sm pt-6 max-w-lg text-red-500">
                                        {emailErrorMessage}
                                    </p>
                                )
                            }
                        </form>
                    ) : (
                        <form onSubmit={locateOrderHandler}>
                            <p className="mx-auto font-normal text-sm my-6 max-w-lg">
                                Email found! Please enter your order number now. If you are having trouble locating your order number, feel free to <span className={"link link-primary"}>contact us</span> for further assistance.
                            </p>
                            <div className={`${orderInputIsFocused ? "ring-2 ring-blue-200 border-blue-400" : "border-gray-300"} flex items-center border bg-white shadow-sm rounded-md overflow-hidden px-2 h-14 justify-between `}>
                                <label className="w-fit text-sm font-medium text-gray-600 tracking-wide border-r border-gray-300 pr-2 h-full flex items-center">Order #
                                </label>
                                <input
                                    onFocus={() => setOrderInputIsFocused(true)}
                                    onBlur={() => setOrderInputIsFocused(false)}
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                    className="bg-white text-base text-gray-600 flex-grow outline-none px-2 "
                                    type="text"
                                    placeholder="Enter your order number"
                                    required
                                />
                                <div className="hidden sm:flex ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                    <CustomBtn type={"submit"}>
                                        Find Order
                                    </CustomBtn>
                                </div>
                            </div>
                            <div className="pt-3 flex sm:hidden justify-end items-center px-2 rounded-lg space-x-4 mx-auto ">
                                <CustomBtn type={"submit"}>
                                    Find Order
                                </CustomBtn>
                            </div>
                            {
                                orderErrorMessage && (
                                    <p className="text-center mx-auto font-normal text-sm pt-6 max-w-lg text-red-500">
                                        {orderErrorMessage}
                                    </p>
                                )
                            }
                        </form>
                    )
                }
            </div>
        </div>
    );
};

export default OrderLocatorPage;