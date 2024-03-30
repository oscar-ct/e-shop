import {useEffect, useState} from 'react';
import {useGetOrdersQuery, useUpdateOrderMutation} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import {FaCheckCircle, FaEdit, FaTruck} from "react-icons/fa";
import {Link} from "react-router-dom";
import AdminTabs from "../components/AdminTabs";
import {setLoading} from "../slices/loadingSlice";
import {useDispatch} from "react-redux";
import {toast} from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import Meta from "../components/Meta";
import CustomBtn from "../components/CustomBtn";
import {ReactComponent as PaypalLogo} from "../icons/paypal-logo.svg";
import {ReactComponent as StripeLogo} from "../icons/stripe-logo.svg";

const AdminOrderListPage = () => {

    const dispatch = useDispatch();

    const {data: orders, isLoading,
        // refetch,
        error} = useGetOrdersQuery();
    const [updateOrder] = useUpdateOrderMutation();

    const [localData, setLocalData] = useState(orders ? orders : null);
    const [editMode, setEditMode] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [isDelivered, setIsDelivered] = useState("");
    const [isShipped, setIsShipped] = useState("");
    const [isReimbursed, setIsReimbursed] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(function () {
        if (orders) {
            if (!localData) {
                setLocalData(orders);
            }
        }
    }, [orders, localData]);

    const confirmUpdateModal = () => {
        let updated = confirmChanges();
        if (updated) {
            setModalMessage(convertToString(updated));
            window.confirm_modal.showModal();
        } else {
            completeEditHandler();
        }
    };
    const editOrderHandler = (id) => {
        const obj = localData.find((x) => x._id === id);
        setEditMode(true);
        setOrderId(id);
        setIsReimbursed(obj.isReimbursed.toString());
        setIsShipped(obj.isShipped.toString());
        setIsDelivered(obj.isDelivered.toString());
        setTrackingNumber(obj.trackingNumber);
    };
    const completeEditHandler = () => {
        setEditMode(false);
        setTrackingNumber("");
        setOrderId(null);
        setIsShipped("");
        setIsDelivered("");
        setIsReimbursed("");
        setModalMessage("");
    };
    const submitUpdateHandler = async (e) => {
        e.preventDefault();
        window.confirm_modal.close();
        dispatch(setLoading(true));
        const updatedOrder = {
            orderId,
            isShipped: isShipped,
            trackingNumber,
            isDelivered: isDelivered,
            isReimbursed: isReimbursed,
        }
        try {
            const res = await updateOrder(updatedOrder).unwrap();
            // refetch();
            toast.success("Order Successfully Updated!")
            setLocalData(prevState => {
                return prevState.map(function (obj) {
                    if (obj._id === res._id) {
                        return res;
                    } else {
                        return obj;
                    }
                });
            });
        } catch (e) {
            console.log(e);
        }
        completeEditHandler();
        dispatch(setLoading(false));
    };

    const confirmChanges = () => {
        const updatedObj = localData.find(function (obj) {
            return obj._id === orderId;
        });
        const b = {
            isShipped,
            isDelivered,
            isReimbursed,
            trackingNumber,

        }
        const a = {
            isShipped: updatedObj.isShipped.toString(),
            isDelivered: updatedObj.isDelivered.toString(),
            isReimbursed: updatedObj.isReimbursed.toString(),
            trackingNumber: updatedObj.trackingNumber

        }
        return Object.entries(b).filter(([key, val]) => a[key] !== val && key in a).reduce((a, [key, v]) => ({
            ...a,
            [key]: v
        }), null);
    };
    const convertToString = () => {
        let message = "";
        const updates = confirmChanges();
        if (updates) {
            for (const key in updates) {
                message += `${key}: ${updates[key]}&`;
            }
        }
        return message;
    };

    const trackingNumberHandler = (orderId, trackingNumber, isShipped) => {
        if (trackingNumber) {
            setTrackingNumber(trackingNumber);
        }
        setOrderId(orderId);
        setIsShipped(isShipped);
        window.tracking_modal.showModal();
    };

    const submitTrackingNumber = async (e) => {
        e.preventDefault();
        const updatedOrder = {
            orderId,
            trackingNumber,
        }
        try {
            const res = await updateOrder(updatedOrder).unwrap();
            toast.success("Tacking number updated!")
            // refetch();
            setLocalData(prevState => {
                return prevState.map(function (obj) {
                    if (obj._id === res._id) {
                        return res;
                    } else {
                        return obj;
                    }
                });
            });
        } catch (e) {
            console.log(e);
        }
        window.tracking_modal.close();
        setTrackingNumber("");
        setIsShipped("");
        setOrderId(null);
    };

    const closeTrackingNumberModal = () => {
        setTimeout(function () {
            setTrackingNumber("");
            setIsShipped("");
            setOrderId(null);
        }, 300);
    };

    const orderStatus = (order) => {
        return (
            order.isCanceled && order.orderItems.length === order.canceledItems.length ? (
                <span className={"rounded-full px-2 h-5 flex items-center text-white bg-neutral font-semibold"}>
                    Canceled
                </span>
            ) : order.isDelivered ? ( <span className={"rounded-full px-2 h-5 flex items-center text-white bg-yellow-500 font-semibold"}>
                    Delivered
                </span>
            ) : order.isShipped ? ( <span className={"rounded-full px-2 h-5 flex items-center text-white bg-blue-500 font-semibold"}>
                    Shipped
                </span>
            ) : !order.isPaid && !order.isCanceled ? ( <span className={"rounded-full px-2 h-5 flex items-center text-white bg-red-500 font-semibold"}>
                  Unpaid
                </span>
            ) : <span className={"rounded-full px-2 h-5 flex items-center text-white bg-green-500 font-semibold"}>
                    Paid
                </span>
        )
    };
    const refundRequired = (order) => {
        return (
            order.isPaid && (order.orderItems.reduce((acc, item) => {return (item.isPaid && item.isCanceled) + acc}, 0) !== 0) && !order.isDelivered && !order.isShipped && !order.isReimbursed && (
                <div className={"flex items-center text-red-500 w-min"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className={"pl-1"}>requires refund</span>
                </div>
            )
        )
    };
    const refundOrder = (order) => {
        return (
            order.isPaid && (order.orderItems.reduce((acc, item) => {return (item.isPaid && item.isCanceled) + acc}, 0) !== 0) && !order.isDelivered && !order.isShipped && order.isReimbursed && (
                <span className={"rounded-full px-2 h-5 flex items-center text-white bg-violet-700 font-semibold"}>
                    Reimbursed
                </span>
            )
        )
    };

    return (
        isLoading || !localData ? <Spinner/> : error ? error : (
            <>
                <Meta title={"Order List"}/>
                <div className={"sm:py-10"}>
                    <AdminTabs/>
                    <div className={"sm:mt-5 bg-white"}>
                        <div className="overflow-x-auto px-5 py-6 border">
                            <div className={"flex flex-wrap w-full justify-between pb-8 sm:px-4 text-xs sm:text-sm lg:text-lg ibmplex font-light"}>
                                <div className={"flex flex-col gap-2"}>
                                    <div>
                                        Orders: <span className={"font-bold"}>{orders.length}</span>
                                    </div>
                                    <div>
                                        Canceled: <span className={"font-bold"}>{orders.reduce((acc, order) => {return (order.isCanceled && !order.isDelivered && !order.isShipped) + acc}, 0)}</span>
                                    </div>

                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <div>
                                        Paid: <span className={"font-bold"}>{orders.reduce((acc, order) => {return (order.isPaid && !order.isCanceled && !order.isDelivered && !order.isShipped) + acc}, 0)}</span>
                                    </div>
                                    <div>
                                        Unpaid: <span className={"font-bold"}>{orders.reduce((acc, order) => {return (!order.isPaid && !order.isCanceled && !order.isDelivered && !order.isShipped) + acc}, 0)}</span>
                                    </div>

                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <div>
                                        Shipped: <span className={"font-bold"}>{orders.reduce((acc, order) => {return (order.isPaid && !order.isCanceled && !order.isDelivered && order.isShipped) + acc}, 0)}</span>
                                    </div>
                                    <div>
                                        Delivered: <span className={"font-bold"}>{orders.reduce((acc, order) => {return (order.isPaid && !order.isCanceled && order.isDelivered && order.isShipped) + acc}, 0)}</span>
                                    </div>

                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <div className={"flex items-center gap-1"}>
                                        <div className={"flex items-center text-red-500"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-4 h-4 md:w-5 md:h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            <span className={"pl-1"}>Requires Refund:</span>
                                        </div>
                                        <span className={"font-bold text-red-500"}>{orders.reduce((acc, order) => {return (order.isPaid && (order.orderItems.reduce((acc, item) => {return (item.isPaid && item.isCanceled) + acc}, 0) !== 0) && !order.isDelivered && !order.isShipped && !order.isReimbursed) + acc}, 0)}</span>
                                    </div>
                                    <div>
                                        Reimbursed: <span className={"font-bold"}>{orders.reduce((acc, order) => {return (order.isPaid && (order.orderItems.reduce((acc, item) => {return (item.isPaid && item.isCanceled) + acc}, 0) !== 0) && !order.isDelivered && !order.isShipped && order.isReimbursed) + acc}, 0)}</span>
                                    </div>

                                </div>

                            </div>
                            <table className="table table-zebra w-fit md:w-full table-xs">
                                <thead>
                                <tr>
                                    <th/>
                                    <th>Order #</th>
                                    <th className={"p-1"}>User</th>
                                    <th className={"p-1"}>Order date</th>
                                    <th className={"p-1"}>Amount</th>
                                    <th className={"p-1"}>Service</th>
                                    <th className={"p-1"}>Status</th>
                                    <th className={"p-1"}>Refund</th>
                                    <th className={"p-1"}>Shipped</th>
                                    <th className={"p-1"}>Delivered</th>
                                    <th/>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    localData && (
                                        localData.map(function(order, index) {
                                            return (
                                                <tr className={"hover"} key={index}>

                                                    <>
                                                        <th className={`${editMode && order._id === orderId ? "bg-blue-200" : ""} p-1`}>
                                                            {orders.length - index}
                                                        </th>
                                                        <td className={`${editMode && order._id === orderId ? "bg-blue-200" : ""} p-1`}>
                                                            <Link className={"link link-primary"} to={`/order/${order._id}`}>
                                                                {order._id.substring(order._id.length - 6, order._id.length)}
                                                            </Link>
                                                        </td>
                                                        <td className={`${editMode && order._id === orderId ? "bg-blue-200" : ""} p-1`}>
                                                            {order.user?.name}
                                                        </td>
                                                        <td className={`${editMode && order._id === orderId ? "bg-blue-200" : ""} p-1`}>
                                                            {order.createdAt.substring(0, 10)}
                                                        </td>
                                                        <td className={`${editMode && order._id === orderId ? "bg-blue-200" : ""} p-1`}>
                                                            ${order.totalPrice.toFixed(2)}
                                                        </td>
                                                        <td className={`${editMode && order._id === orderId ? "bg-blue-200" : ""} p-1`}>
                                                            {order.paymentMethod === "Stripe / Credit Card" ? <StripeLogo width={35}/> : <PaypalLogo width={30} height={30}/>}
                                                        </td>
                                                        <td className={`${editMode && order._id === orderId ? "bg-blue-200" : ""} p-1`}>
                                                            <div className={"flex items-center gap-1"}>
                                                                {orderStatus(order)}
                                                                {refundRequired(order)}
                                                                {refundOrder(order)}
                                                            </div>
                                                        </td>
                                                        <td className={`${editMode && order._id === orderId ? "bg-blue-200" : ""} p-1`}>
                                                            <select
                                                                className="bg-white w-11 shadow border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                value={isReimbursed}
                                                                onChange={(e) => setIsReimbursed(e.target.value)}
                                                                disabled={!editMode && order._id !== orderId}
                                                            >
                                                                {
                                                                    editMode && order._id === orderId && (
                                                                        <>
                                                                            <option value={"true"}>
                                                                                yes
                                                                            </option>
                                                                            <option value={"false"}>
                                                                               no
                                                                            </option>
                                                                        </>
                                                                    )
                                                                        // <option value="" disabled selected>{order.isReimbursed ? "yes" : "no"}</option>
                                                                }
                                                            </select>
                                                        </td>
                                                        <td className={`${editMode && order._id === orderId ? "bg-blue-200" : ""} p-1`}>
                                                            <select
                                                                className="bg-white w-11 shadow border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                value={isShipped}
                                                                onChange={(e) => setIsShipped(e.target.value)}
                                                                disabled={!editMode && order._id !== orderId}
                                                            >
                                                                {
                                                                    editMode && order._id === orderId && (
                                                                        <>
                                                                            <option value={"true"}>
                                                                                yes
                                                                            </option>
                                                                            <option value={"false"}>
                                                                                no
                                                                            </option>
                                                                        </>
                                                                    )
                                                                }
                                                            </select>
                                                        </td>
                                                        <td className={`${editMode && order._id === orderId ? "bg-blue-200" : ""} p-1`}>
                                                            <select
                                                                className="bg-white w-11 shadow border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                value={isDelivered}
                                                                onChange={(e) => setIsDelivered(e.target.value)}
                                                                disabled={!editMode && order._id !== orderId}
                                                            >
                                                                {
                                                                    editMode && order._id === orderId && (
                                                                        <>
                                                                            <option value={"true"}>
                                                                                yes
                                                                            </option>
                                                                            <option value={"false"}>
                                                                                no
                                                                            </option>
                                                                        </>
                                                                    )
                                                                }
                                                            </select>
                                                        </td>
                                                        {
                                                            editMode && order._id === orderId ? (
                                                                <td className={"p-1 w-20 bg-blue-200"}>
                                                                    <div className={"flex items-center"}>
                                                                        <div className="tooltip tooltip-bottom" data-tip="save changes">
                                                                            <button onClick={confirmUpdateModal} className={"text-green-500 btn-glass btn-sm rounded-full"}>
                                                                                <FaCheckCircle/>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            ) : (
                                                                <td className={`p-1 w-20`}>
                                                                    <div className={"flex items-center"}>
                                                                        <button onClick={() => editOrderHandler(order._id)} className={"btn-glass btn-sm rounded-full hover:text-primary"}>
                                                                            <FaEdit/>
                                                                        </button>
                                                                        <button onClick={() => trackingNumberHandler(order._id, order.trackingNumber, order.isShipped)} className={` btn-glass btn-sm rounded-full hover:text-primary ${editMode && "hidden"}`}>
                                                                            <FaTruck/>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )
                                                        }
                                                    </>
                                                </tr>

                                            );
                                        })
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/*MODALS BELOW*/}

                <ConfirmModal title={"Confirm Changes"} initiateFunction={submitUpdateHandler}>
                    <h3 className="font-semibold text-lg">Please confirm these are the changes you wish to make --</h3>
                        {
                            modalMessage !== "" && (
                                modalMessage.split("&").map(function(sentence, index){
                                    return (
                                        <p className={"pt-3"} key={index}>{sentence}</p>
                                    )
                                })
                            )
                        }
                </ConfirmModal>
                <dialog id="tracking_modal" className="modal modal-bottom sm:modal-middle">
                    <form method="dialog" className="modal-box bg-white">
                        <div className="p-3">
                            <div className="form-control w-full">
                                <h3 className="pb-3 font-bold text-xl">
                                    Tracking Number
                                </h3>
                                {
                                    !isShipped && (
                                        <h5 className={"pb-3 text-lg text-red-500"}>
                                            This order has not been marked as shipped, please mark as shipped to continue.
                                        </h5>
                                    )
                                }
                                <input
                                    disabled={!isShipped}
                                    type="text"
                                    placeholder="Enter tacking number"
                                    className="bg-white input input-bordered w-full"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber((e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="modal-action">
                            <button
                                onClick={closeTrackingNumberModal}
                                className={"btn btn-neutral rounded-full normal-case"}
                            >
                                Cancel
                            </button>
                            <CustomBtn onClick={submitTrackingNumber} isDisabled={!isShipped} type={"submit"} customClass={"text-sm"}>
                                Submit
                            </CustomBtn>
                        </div>
                    </form>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </>
       )
    );
};

export default AdminOrderListPage;