import {useEffect, useState} from 'react';
import {useGetOrdersQuery, useUpdateOrderMutation} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import {FaCheck, FaCheckCircle, FaEdit, FaTimes, FaTruck} from "react-icons/fa";
import {Link} from "react-router-dom";
import AdminTabs from "../components/AdminTabs";
import {setLoading} from "../slices/loadingSlice";
import {useDispatch} from "react-redux";
import {toast} from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import Meta from "../components/Meta";

const AdminOrderListPage = () => {

    const dispatch = useDispatch();

    const {data: orders, isLoading,
        // refetch,
        error} = useGetOrdersQuery();
    const [updateOrder] = useUpdateOrderMutation();

    const [localData, setLocalData] = useState(orders ? orders : null);
    const [editMode, setEditMode] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [isDelivered, setIsDelivered] = useState(null);
    const [isShipped, setIsShipped] = useState(null);
    const [isReimbursed, setIsReimbursed] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    // const [trackingNumberModalIsOpen, setTrackingNumberModalIsOpen] = useState(false);

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
    }
    const completeEditHandler = () => {
        setEditMode(false);
        setTrackingNumber("");
        setOrderId(null);
        setIsShipped(null);
        setIsDelivered(null);
        setIsReimbursed(null);
        setModalMessage("");
    }
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
    }

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

    useEffect(function () {
        if (orders) {
            if (!localData) {
                setLocalData(orders);
            }
        }
    }, [orders, localData]);

    const orderStatus = (order, className) => {
        return (
            <td className={className}>
                {order.isCanceled && order.orderItems.length === order.canceledItems.length ? (
                    <span className={"px-2 py-1 text-white rounded-lg bg-neutral shadow-xl font-bold"}>
                        Canceled
                    </span>
                ) : order.isDelivered ? ( <span className={"px-2 py-1 text-white rounded-lg font-bold bg-green-500 shadow-xl"}>
                        Delivered
                    </span>
                ) : order.isShipped ? ( <span className={"px-2 py-1 text-white rounded-lg font-bold bg-blue-500 shadow-xl"}>
                        Shipped
                    </span>
                ) : !order.isPaid && !order.isCanceled ? ( <span className={"px-2 py-1 text-white rounded-lg font-bold bg-red-500 shadow-xl"}>
                      Not Paid
                    </span>
                ) : <span className={"px-2 py-1 text-black-500 rounded-lg font-bold bg-base-100 shadow-xl"}>
                        In Progress
                    </span>
                }
            </td>
        )
    }

    const trackingNumberHandler = (orderId, trackingNumber, isShipped) => {
        if (trackingNumber) {
            setTrackingNumber(trackingNumber);
        }
        setOrderId(orderId);
        setIsShipped(isShipped);
        // setTrackingNumberModalIsOpen(true);
        window.tracking_modal.showModal();
    }

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
        // setTrackingNumberModalIsOpen(false);
        setTrackingNumber("");
        setIsShipped(null);
        setOrderId(null);
        // closeTrackingNumberModal();
    }

    const closeTrackingNumberModal = () => {
        // e && e.preventDefault();
        // window.tracking_modal.close();
        setTimeout(function () {
            // setTrackingNumberModalIsOpen(false);
            setTrackingNumber("");
            setIsShipped(null);
            setOrderId(null);
        }, 300);
    }


    return (
        isLoading || !localData ? <Spinner/> : error ? error : (
            <>
                <Meta title={"Order List"}/>
                <div className={"py-10"}>
                    <AdminTabs/>
                    <div className={"mt-5 card bg-white shadow-xl"}>
                        <div className={"w-full px-5 flex justify-center pt-5"}>
                            <div className={" text-2xl text-center"}>
                                Orders ({localData.length})
                            </div>

                        </div>
                        <div className="overflow-x-auto px-5 py-10">
                            <table className="table table-zebra w-fit lg:w-full table-xs">
                                <thead>
                                <tr>
                                    <th/>
                                    <th>Order #</th>
                                    <th className={"p-1"}>User</th>
                                    <th className={"p-1"}>Order date</th>
                                    <th className={"p-1"}>Total (USD)</th>

                                    <th className={"p-1"}>Status</th>
                                    <th className={"p-1"}>Refund</th>
                                    <th className={"p-1"}>Paid</th>
                                    <th className={"p-1"}>Shipped</th>
                                    {/*<th className={"p-1"}>Tracking</th>*/}
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

                                                    {
                                                        editMode && order._id === orderId ? (
                                                            <>
                                                                <th className={"bg-blue-200"}>{index+1}</th>
                                                                <td className={"bg-blue-200"}>{order._id.substring(order._id.length - 6, order._id.length)}</td>
                                                                <td className={"p-1 bg-blue-200"}>{order.user?.name}</td>
                                                                <td className={"p-1 bg-blue-200"}>{order.createdAt.substring(0, 10)}</td>
                                                                <td className={"p-1 bg-blue-200"}>${order.totalPrice.toFixed(2)}</td>
                                                                {
                                                                    orderStatus(order, "bg-blue-200 p-1")
                                                                }
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <select
                                                                        className="bg-white pl-1 w-16 shadow border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        value={isReimbursed}
                                                                        onChange={(e) => setIsReimbursed(e.target.value)}
                                                                    >
                                                                        <option value={"true"}>
                                                                            true
                                                                        </option>
                                                                        <option value={"false"}>
                                                                            false
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                                <td className={"p-1 bg-blue-200 truncate"}>{order.isPaid ? order.paidAt.substring(0,10) : <FaTimes fill={"red"}/>}
                                                                </td>
                                                                {/*<td className={"p-1 bg-blue-200"}>*/}
                                                                {/*    {order.isCanceled ? order.canceledAt.substring(0, 10) : "Active"}*/}
                                                                {/*</td>*/}
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <select
                                                                        className="bg-white pl-1 w-16 shadow border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        value={isShipped}
                                                                        onChange={(e) => setIsShipped(e.target.value)}
                                                                    >
                                                                        <option value={"true"}>
                                                                            true
                                                                        </option>
                                                                        <option value={"false"}>
                                                                            false
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                                {/*<td className={"p-1 bg-blue-200"}>*/}
                                                                {/*    <input*/}
                                                                {/*        className="pl-1 shadow appearance-none border rounded w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"*/}
                                                                {/*        type={"text"}*/}
                                                                {/*        value={trackingNumber}*/}
                                                                {/*        onChange={(e) => setTrackingNumber(e.target.value)}*/}
                                                                {/*    />*/}
                                                                {/*</td>*/}
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <select
                                                                        className="bg-white pl-1 w-16 shadow border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        value={isDelivered}
                                                                        onChange={(e) => setIsDelivered(e.target.value)}
                                                                    >
                                                                        <option value={"true"}>
                                                                            true
                                                                        </option>
                                                                        <option value={"false"}>
                                                                            false
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <div className={"flex items-center"}>
                                                                        <div className="tooltip tooltip-bottom" data-tip="save changes">
                                                                            <button onClick={confirmUpdateModal} className={"text-green-500 btn-glass btn-sm rounded-full"}>
                                                                                <FaCheckCircle/>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <th>{index+1}</th>
                                                                <td><Link className={"link link-primary"} to={`/order/${order._id}`}>{order._id.substring(order._id.length - 6, order._id.length)}</Link></td>
                                                                <td className={"p-1"}>{order.user?.name}</td>
                                                                <td className={"p-1"}>{order.createdAt.substring(0, 10)}</td>
                                                                <td className={"p-1"}>${order.totalPrice.toFixed(2)}</td>
                                                                {
                                                                    orderStatus(order, "p-1 truncate")
                                                                }
                                                                <td className={"p-1"}>
                                                                    {(order.isCanceled || order.canceledItems.length !== 0) && order.isPaid && !order.isReimbursed ? (
                                                                        <span className={"px-2 py-1 text-white rounded-lg font-bold bg-purple-500 shadow-xl"}>
                                                                            Required
                                                                        </span>
                                                                    ) : order.isReimbursed && (
                                                                    <span className={"px-2 py-1 text-green-500 rounded-lg font-bold bg-base-100 shadow-xl"}>
                                                                           Complete
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className={"p-1 truncate"}>{order.isPaid ? order.paidAt.substring(0,10) : <FaTimes fill={"red"}/>}
                                                                </td>
                                                                <td className={"p-1"}>{order.isShipped ? <FaCheck className={"text-green-500"}/> : <FaTimes fill={"red"}/>}
                                                                </td>
                                                                {/*<td className={"p-1"}>{order.isShipped && order.trackingNumber ? order.trackingNumber : <FaTimes fill={"red"}/>}*/}
                                                                {/*</td>*/}
                                                                <td className={"p-1 truncate"}>{order.isDelivered ? order.deliveredAt.substring(0,10) : <FaTimes fill={"red"}/>}
                                                                </td>
                                                                <td className={"p-1 w-20"}>
                                                                    <div className={"flex items-center"}>
                                                                        <button onClick={() => editOrderHandler(order._id)} className={"btn-glass btn-sm rounded-full hover:text-primary"}>
                                                                            <FaEdit/>
                                                                        </button>
                                                                        <button onClick={() => trackingNumberHandler(order._id, order.trackingNumber, order.isShipped)} className={` btn-glass btn-sm rounded-full hover:text-primary ${editMode && "hidden"}`}>
                                                                            <FaTruck/>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )
                                                    }
                                                </tr>

                                            )
                                        })
                                    )

                                }
                                </tbody>
                                <tfoot>
                                </tfoot>
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
                    {/*{*/}
                    {/*    trackingNumberModalIsOpen && (*/}
                            <form method="dialog" className="modal-box bg-white">
                                <div className="p-3">
                                    {
                                        isShipped ? (
                                            <div className="form-control w-full">
                                                <div className={"flex justify-between items-center"}>
                                                    <h3 className="pb-3 font-bold text-xl">
                                                        Tracking Number
                                                    </h3>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder={"Enter a tracking number"}
                                                    className="bg-white input input-bordered w-full"
                                                    value={trackingNumber}
                                                    onChange={(e) => setTrackingNumber((e.target.value))}
                                                />
                                            </div>
                                        ) : (
                                            <div className="form-control w-full">
                                                <h3 className="pb-3 font-bold text-xl">
                                                    Tracking Number
                                                </h3>
                                                <h5 className={"pb-3 text-lg text-red-500"}>
                                                    This order has not been marked as shipped, please mark as shipped to continue.
                                                </h5>
                                                <input
                                                    disabled={true}
                                                    type="text"
                                                    placeholder="Enter tacking number"
                                                    className="bg-white input input-bordered w-full"
                                                    value={trackingNumber}
                                                    onChange={(e) => setTrackingNumber((e.target.value))}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="modal-action">
                                    <button
                                        onClick={closeTrackingNumberModal}
                                        className={"btn btn-neutral rounded-xl"}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={!isShipped}
                                        onClick={submitTrackingNumber}
                                        className="btn rounded-xl"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                            <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                            </form>
                    {/*    )*/}
                    {/*}*/}
                </dialog>
            </>

       )
    );
};

export default AdminOrderListPage;