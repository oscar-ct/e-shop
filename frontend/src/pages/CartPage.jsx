import {Link, useNavigate} from "react-router-dom";
import Message from "../components/Message";
import {useSelector} from "react-redux";
import CartItem from "../components/CartItem";
import CheckoutSteps from "../components/CheckoutSteps";
import Meta from "../components/Meta";
import CustomBtn from "../components/CustomBtn";
import BackButton from "../components/BackButton";

const CartPage = () => {

    const navigate = useNavigate();

    const {cartItems, guestData} = useSelector(function (state) {
        return state.cart;
    });
    const {userData} = useSelector(function (state) {
        return state.auth;
    });

    const totalPrice =  cartItems.reduce(function (acc, product) {
        return acc + product.quantity * product.price;
    }, 0).toFixed(2);

    const checkoutHandler = () => {
        if (userData) {
            navigate("/shipping");
        }  else if (!userData && guestData) {
            navigate("/shipping");
        } else {
            window.checkout_modal.showModal();
        }
    };

    const totalNumberOfItems = cartItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);

    return (
        <>
            <Meta title={"Shopping Cart"}/>

            {
                cartItems.length === 0 ? (
                <>
                    <BackButton/>
                    <div className={"px-2"}>
                        <div className={"pt-12 md:pt-20 px-2"}>
                            <div className={"text-4xl pb-10 flex justify-center"}>
                                Shopping Cart (0)
                            </div>
                            <Message variant={"info"}>
                                You have no items in your cart.  Click <Link to={"/sort/latest/select/all"} className={"link link-primary"}>here</Link> to continue shopping.
                            </Message>
                        </div>
                    </div>
                </>
                ) : (
                    <>
                        <CheckoutSteps/>
                        <div className={"flex-col flex lg:flex-row w-full md:pl-3 md:pr-3 lg:pr-0 2xl:container mx-auto"}>
                            <div className={"lg:w-8/12 h-min"}>
                                <div className={"pt-3 sm:pt-7"}>
                                    <h1
                                        // style={{background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(216,228,253,1) 100%)"}}
                                        className={"hidden md:block py-2 text-center text-3xl md:text-2xl ibmplex bg-white md:bg-zinc-700 md:text-white font-semibold"}>
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
                                <div className={"lg:overflow-y-auto lg:min-h-[275px] lg:md:max-h-[calc(100vh-388px)] bg-white border pt-10 px-4 sm:px-7 pb-4 sm:pb-7 overflow-y"}>
                                    {
                                        cartItems.map(function (item) {
                                            return (
                                                <CartItem item={item} key={item._id}/>
                                            )
                                        })
                                    }
                                </div>
                            </div>
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
                            <div className={"lg:pt-7 px-3 w-96 place-self-end lg:place-self-start lg:pl-5 lg:w-4/12"}>
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
                                <div className="lg:my-0 mb-5 lg:w-full border bg-white self-end">
                                    <div className="px-8 py-5">
                                        <div className={"flex flex-col"}>
                                            <h3 className={"text-lg"}>
                                                Subtotal (
                                                <span className={"text-[16px] font-semibold"}>
                                                    {totalNumberOfItems}
                                                    {totalNumberOfItems > 1 ? (" Items") : (" Item")}
                                                </span>)
                                            </h3>
                                            <div className={"text-xs py-1"}>Taxes will be calculated at checkout</div>
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
                                        <CustomBtn onClick={checkoutHandler}>
                                            Proceed To Checkout
                                        </CustomBtn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
            <dialog id="checkout_modal" className="modal modal-bottom sm:modal-middle">
                <form method="dialog" className="modal-box bg-white">
                    <div className="p-3">
                        <div className="form-control w-full">
                            <div className={"flex justify-between items-center"}>
                                <div className="pb-3 font text-lg">
                                    You are currently not logged in, we<span className={"px-1 font-bold"}>recommend</span>you login prior to placing any orders.  This will allow you to seamlessly view and manage all your orders.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-action w-full flex justify-center">
                        <button
                            onClick={() => navigate("/shipping")}
                            className={"btn btn-neutral rounded-full normal-case"}
                        >
                            Continue As Guest
                        </button>
                        <CustomBtn onClick={() => navigate('/login?redirect=/shipping')} type={"submit"} customClass={"text-sm font-semibold"}>
                           Login / Sign Up
                        </CustomBtn>
                    </div>
                </form>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
};

export default CartPage;