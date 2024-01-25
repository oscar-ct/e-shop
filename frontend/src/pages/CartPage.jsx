import {Link, useNavigate} from "react-router-dom";
import Message from "../components/Message";
import {useSelector} from "react-redux";
import CartItem from "../components/CartItem";
import CheckoutSteps from "../components/CheckoutSteps";
import BackButton from "../components/BackButton";
import Meta from "../components/Meta";

const CartPage = () => {

    const navigate = useNavigate();

    const {cartItems} = useSelector(function (state) {
        return state.cart;
    });
    const {userData} = useSelector(function (state) {
        return state.auth;
    });

    const totalPrice =  cartItems.reduce(function (acc, product) {
        return acc + product.quantity * product.price;
    }, 0).toFixed(2);

    const checkoutHandler = () => {
        userData ? navigate("/shipping") : navigate('/login?redirect=/shipping');
    };

    const totalNumberOfItems = cartItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);

    return (
        <div>
            <Meta title={"Shopping Cart"}/>
            {
                cartItems.length === 0 ? (
                    <div className={"px-2"}>
                        <BackButton/>
                        <div className={"lg:pt-4 pt-20 px-2"}>
                            <Message variant={"info"}>
                                You have no items in your cart.  Click <Link to={"/"} className={"link link-primary"}>here</Link> to continue shopping.
                            </Message>
                        </div>
                    </div>
                ) : (
                    <>
                        <CheckoutSteps step1 />
                        <div className={"flex-col flex lg:flex-row w-full"}>
                            <div className={"lg:hidden"}>
                            {
                                totalPrice > 100 ? (
                                    <div className={"py-3 px-2 sm:px-0"}>
                                        <Message variant={"success"}>
                                                <span className={"text-sm"}>
                                                    Your order qualifies for FREE shipping!
                                                </span>
                                        </Message>
                                    </div>
                                ) : (
                                    <div className={"py-3 px-2 sm:px-0"}>
                                        <Message variant={"info"}>
                                                <span className={"text-sm"}>
                                                    Add <span className={"font-bold"}>${(100 - totalPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.
                                                </span>
                                        </Message>
                                    </div>
                                )
                            }
                            </div>
                            <div className={"lg:mb-10 lg:w-8/12 bg-white h-min"}>
                                <div className={"pt-4 sm:pt-7"}>
                                    <h1
                                        // style={{background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(216,228,253,1) 100%)"}}
                                        className={"py-2 text-center text-3xl md:text-2xl ibmplex bg-white md:bg-neutral md:text-white"}>
                                         Shopping Cart (
                                        <span className={"text-2xl md:text-xl md:text-white md:font-light"}>
                                            {totalNumberOfItems}
                                            {
                                                totalNumberOfItems === 1 ? (
                                                    " Item"
                                                ) : (
                                                    " Items"
                                                )
                                            }
                                        </span>
                                        )
                                    </h1>
                                </div>
                                <div className={"border pt-10 px-4 sm:px-7 pb-4 sm:pb-7"}>
                                    {
                                        cartItems.map(function (item) {
                                            return (
                                                <CartItem item={item} key={item._id}/>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className={"lg:pt-7 px-4 w-96 place-self-end lg:place-self-start lg:pl-10 lg:w-4/12"}>
                                <div className={"hidden lg:flex"}>
                                    {
                                        totalPrice > 100 ? (
                                            <div className={"pb-3 w-full"}>
                                                <Message variant={"success"} border={"rounded-xl"}>
                                                    <span className={"text-sm"}>
                                                        Your order qualifies for FREE shipping!
                                                    </span>
                                                </Message>
                                            </div>
                                        ) : (
                                            <div className={"pb-3 w-full"}>
                                                <Message variant={"info"} border={"rounded-xl"}>
                                                    <span className={"text-sm"}>
                                                        Add <span className={"font-bold"}>${(100 - totalPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.
                                                    </span>
                                                </Message>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="my-10 lg:my-0 lg:w-full border bg-white self-end">
                                    <div className="px-8 py-5">
                                        <div className={"flex flex-col"}>
                                            <h3 className={"text-lg"}>
                                                Subtotal ({totalNumberOfItems}
                                                {
                                                    totalNumberOfItems > 1 ? (" Items") : (" Item")
                                                }
                                                )
                                            </h3>
                                            <div className={"border-b-[1px] border-gray-300 my-2"}/>
                                            <div className={"flex justify-end"}>
                                                <span className="text-xl font-semibold">
                                                    ${totalPrice}
                                                    <span className={"pl-1 text-xs font-semibold"}>
                                                        USD
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-actions justify-end px-5 pb-5">
                                        <button
                                            onClick={checkoutHandler}
                                            className="shadow-blue btn btn-primary rounded-xl"
                                        >
                                            Proceed To Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default CartPage;