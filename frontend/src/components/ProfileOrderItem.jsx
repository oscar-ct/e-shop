import {useState} from "react";
import ProfileOrderItemProduct from "./ProfileOrderItemProduct";
import {Link, useNavigate} from "react-router-dom";
import Message from "./Message";
// import {useCancelOrderItemMutation, useCancelOrderMutation} from "../slices/ordersApiSlice";
import {FaRegCopy} from "react-icons/fa";
import {useDispatch} from "react-redux";
import {setOrder} from "../slices/orderSlice";


const ProfileOrderItem = ({order, index, orderLength}) => {
    const navigate = useNavigate();
    // const [productId, setProductId] = useState("");
    const dispatch = useDispatch();
    const [copyMessage, setCopyMessage] = useState("copy to clipboard");

    const cancelOrderItemHandler = async (productId) => {
        const data = {_id: order._id, canceledItems: order.canceledItems, orderItemsLength: order.orderItems.length, isCanceled: order.isCanceled, productId: productId}
        dispatch(setOrder(data));
        window.confirm_modal.showModal();
    }


    const copyToClipboard = async () => {
        setCopyMessage("copied!")
        await navigator.clipboard.writeText(order.trackingNumber);
        setTimeout(function () {
            setCopyMessage("copy to clipboard")
        }, 1500)
    }


    return (
        <>
        <div className={`mb-5 sm:mb-0 px-3 sm:px-8 lg:px-14 xl:px-24 ${index+1 !== orderLength && "pb-16"}`}>
            <div className={"bg-white w-full flex flex-col"}>
                <div className={"p-6 rounded-tr-xl rounded-tl-xl flex flex-row bg-neutral-100"}>
                    <div className={"w-full flex justify-between"}>
                        <div className={"flex"}>
                            <div className={"flex flex-col lg:pr-3"}>
                                <span className={"text-xs font-bold"}>
                                    ORDER PLACED
                                </span>
                                <span className={"text-sm"}>
                                    {order.createdAt.substring(0, 10)}
                                </span>
                            </div>
                            <div className={"flex flex-col pl-3 lg:pr-3"}>
                                <span className={"text-xs font-bold"}>
                                    TOTAL
                                </span>
                                <span className={"text-sm"}>
                                    ${order.totalPrice.toFixed(2)}
                                </span>
                            </div>
                            <div className={"flex flex-col pl-3 lg:pr-3"}>
                                <span className={"text-xs font-bold"}>
                                    SHIP TO
                                </span>
                                <div className="tooltip tooltip-bottom" data-tip={`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`}>
                                    <span className={"cursor-default text-primary text-sm"}>
                                        {order.user.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={"flex flex-col pl-3 lg:pr-3"}>
                            <span className={"hidden md:flex text-xs font-bold text-end"}>
                                ORDER # {order._id}
                            </span>
                            <Link to={`/order/${order._id}`} className={"text-end link link-primary text-sm"}>
                                View order details
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={"border"}>
            {
                !order.isPaid && (!order.isCanceled || order.orderItems.length !== order.canceledItems.length) && (
                    <div className={"pt-3 px-10"}>
                        <div className={"w-full"}>
                            <Message variant={"warning"}>
                                Awaiting payment, please
                                <Link
                                    to={`/order/${order._id}`}
                                    className={"pl-1 link link-primary"}
                                >
                                    pay now.
                                </Link>
                            </Message>
                        </div>
                    </div>
                )
            }

        {
            order.orderItems.map(function (product, index) {
                return (
                    <div className={"flex flex-col lg:flex-row"} key={product.productId}>
                        <div className={"w-full lg:w-8/12 flex flex-col"}>
                        {
                            order.isPaid && order.isShipped && order.isDelivered && !order.isCanceled ? (
                                <div className={"py-5 px-5"}>
                                    <span className={"text-2xl text-green-500 font-bold"}>
                                        Delivered
                                    </span>
                                </div>
                            ) : (order.isPaid || !order.isPaid) && (order.canceledItems.some(e => e.productId === product.productId) || order.isCanceled) ? (
                                <div className={"py-5 px-5"}>
                                    <span className={"text-red-500 text-2xl font-bold"}>
                                        Canceled
                                    </span>
                                </div>
                            ) : order.isPaid && !order.isShipped && !order.canceledItems.some(e => e.productId === product.productId) && !order.isCanceled ? (
                                <div className={"py-5 px-5"}>
                                    <span className={"text-2xl font-bold"}>
                                    Processing
                                    </span>
                                </div>
                            ) : order.isPaid && order.isShipped && !order.isCanceled ? (
                                <div className={"py-5 px-5"}>
                                    <span className={"text-2xl font-bold"}>
                                        On the way
                                    </span>
                                </div>
                            ) : (
                                <div className={"py-5 px-5"}>
                                    <span className={"text-2xl font-bold"}>
                                        Awaiting Payment
                                    </span>
                                </div>
                            )
                        }
                            <ProfileOrderItemProduct product={product} index={index} orderSize={order.orderItems.length}/>
                        </div>

                        <div className={`px-4 w-full lg:w-4/12 flex items-start py-5 ${index+1 !== order.orderItems.length && "border-b-[1px] border-gray-300 mr-4"}`}>

                            <div className={"w-full flex flex-col md:flex-row lg:flex-col"}>


                                <div className={"py-2 px-1 w-full"}>
                                    <div className={`w-full ${order.trackingNumber && order.isShipped && "tooltip tooltip-top"}`} data-tip={copyMessage}>
                                        <button onClick={copyToClipboard} disabled={(!order.isShipped || order.canceledItems.some(e => e.productId === product.productId))} className={"btn h-fit normal-case text-xs btn-sm w-full"}>
                                            <FaRegCopy/>
                                            Tracking Number
                                        </button>
                                    </div>
                                </div>

                                {/*Todo*/}
                                {/*<div className={"py-2 w-full"}>*/}
                                {/*    <button disabled={!order.isDelivered} className={"btn normal-case text-xs btn-sm w-full"}>*/}
                                {/*        Return or replace*/}
                                {/*    </button>*/}
                                {/*</div>*/}

                                <div className={"py-2 px-1 w-full"}>
                                    <button onClick={() => navigate(`/product/${product.productId}?review=true`)} disabled={!order.isDelivered} className={"btn normal-case text-xs btn-sm w-full"}>
                                        Write a product review
                                    </button>
                                </div>

                                {
                                    !order.isShipped && !order.isDelivered && !order.isCanceled && !order.canceledItems.some(e => e.productId === product.productId) && (
                                        <div className={"py-2 px-1 w-full"}>
                                            <button onClick={() => cancelOrderItemHandler(product.productId)} className={"btn normal-case text-xs btn-sm w-full"}>
                                                Cancel Item
                                            </button>
                                        </div>
                                    )
                                }

                            </div>

                        </div>

                    </div>

                )
            })
        }
                </div>
            </div>
        </div>

        </>
    );
};

export default ProfileOrderItem;