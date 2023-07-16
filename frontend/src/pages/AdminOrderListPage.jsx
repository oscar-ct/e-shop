import React, {useEffect, useState} from 'react';
import {useGetOrdersQuery, useUpdateOrderMutation} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import {FaCheck, FaCheckCircle, FaEdit, FaMinusCircle, FaTimes} from "react-icons/fa";
import {Link} from "react-router-dom";
import AdminTabs from "../components/AdminTabs";
import {setLoading} from "../slices/loadingSlice";
import {useDispatch} from "react-redux";

const AdminOrderListPage = () => {

    const dispatch = useDispatch();

    const {data: orders, isLoading, refetch, error} = useGetOrdersQuery();
    const [updateOrder] = useUpdateOrderMutation();

    const [localData, setLocalData] = useState(orders ? orders : null);
    const [editMode, setEditMode] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [isDelivered, setIsDelivered] = useState(null);
    const [isShipped, setIsShipped] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [modalMessage, setModalMessage] = useState("");

console.log()
    const confirmUpdateHandler = () => {
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
        setIsShipped(obj.isShipped.toString());
        setIsDelivered(obj.isDelivered.toString());
        setTrackingNumber(obj.trackingNumber);
    }
    const completeEditHandler = () => {
        setEditMode(false);
        setOrderId(null);
        setIsShipped(null);
        setIsDelivered(null);
        setModalMessage("");
    }
    const closeEditModal = (e) => {
        e.preventDefault();
        window.confirm_modal.close();
    }
    const submitUpdateHandler = async (e) => {
        e.preventDefault();
        window.confirm_modal.close();
        dispatch(setLoading(true));
        const updatedOrder = {
            orderId,
            isShipped: isShipped === "true",
            trackingNumber,
            isDelivered: isDelivered === "true",
        }
        try {
            const res = await updateOrder(updatedOrder).unwrap();
            refetch();
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
            trackingNumber,

        }
        const a = {
            isShipped: updatedObj.isShipped.toString(),
            isDelivered: updatedObj.isDelivered.toString(),
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


    return (
        isLoading || !localData ? <Spinner/> : error ? error : (
            <div className={"pt-10"}>
                <AdminTabs/>
                <div className={"mt-5 card bg-base-100 shadow-xl"}>
                    <div className={"w-full px-5 flex justify-center pt-5"}>
                        <div className={" text-2xl text-center font-bold"}>
                            Order List
                        </div>

                    </div>
                    <div className="overflow-x-auto p-5">
                        <table className="table table-zebra w-fit lg:w-full table-sm">
                            <thead>
                            <tr>
                                <th/>
                                <th>Order #</th>
                                <th className={"p-1"}>User</th>
                                <th className={"p-1"}>Order date</th>
                                <th className={"p-1"}>Total (USD)</th>
                                <th className={"p-1"}>Paid</th>
                                <th className={"p-1"}>Shipped</th>
                                <th className={"p-1"}>Tracking</th>
                                <th className={"p-1"}>Delivered</th>
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
                                                            <td className={"p-1 bg-blue-200"}>${order.totalPrice}</td>
                                                            <td className={"p-1 bg-blue-200"}>{order.isPaid ? order.paidAt.substring(0,10) : <FaTimes fill={"red"}/>}</td>

                                                            <td className={"p-1 bg-blue-200"}>
                                                                <select
                                                                    className="pl-1 w-16 shadow border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
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
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    type={"text"}
                                                                    value={trackingNumber}
                                                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <select
                                                                    className="pl-1 w-16 shadow border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
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
                                                                <div className={"flex"}>
                                                                    <button onClick={confirmUpdateHandler} className={"text-green-500 btn-glass btn-sm p-2 rounded-full"}>
                                                                        <FaCheckCircle/>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th>{index+1}</th>
                                                            <td><Link className={"link link-primary"} to={`/order/${order._id}`}>{order._id.substring(order._id.length - 6, order._id.length)}</Link></td>
                                                            <td className={"p-1"}>{order.user?.name}</td>
                                                            <td className={"p-1"}>{order.createdAt.substring(0, 10)}</td>
                                                            <td className={"p-1"}>${order.totalPrice}</td>
                                                            <td className={"p-1"}>{order.isPaid ? order.paidAt.substring(0,10) : <FaTimes fill={"red"}/>}</td>
                                                            <td className={"p-1"}>{order.isShipped ? <FaCheck fill={"green"}/> : <FaTimes fill={"red"}/>}</td>
                                                            <td className={"p-1"}>{order.isShipped && order.trackingNumber ? order.trackingNumber : <FaTimes fill={"red"}/>}</td>
                                                            <td className={"p-1"}>{order.isDelivered ? order.deliveredAt.substring(0,10) : <FaTimes fill={"red"}/>}</td>
                                                            <td className={"p-1"}>
                                                                <div className={"flex"}>
                                                                    <button onClick={() => editOrderHandler(order._id)} className={"btn-glass p-2 btn-sm rounded-full hover:text-primary"}>
                                                                        <FaEdit/>
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
                <dialog id="confirm_modal" className="modal modal-bottom sm:modal-middle">
                    <form method="dialog" className="modal-box">
                        <h3 className="p-4 font-bold text-lg">Please confirm these are the changes you wish to make.</h3>
                        <div className="px-4">
                            {
                                modalMessage !== "" && (
                                    modalMessage.split("&").map(function(sentence, index){
                                        return (
                                            <p className={"py-2"} key={index}>{sentence}</p>
                                        )
                                    })
                                )
                            }
                        </div>
                        <div className="modal-action">
                            <button onClick={closeEditModal} className={"btn btn-error"}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={submitUpdateHandler}
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </dialog>

            </div>



       // isLoading ? <Spinner/> : error ? error : (
       //     <div className={"pt-10"}>
       //
       //         <div className={"card bg-base-100 shadow-xl"}>
       //             <h3 className={"text-2xl font-bold text-center pt-5"}>Orders</h3>
       //             <div className="overflow-x-auto p-5">
       //                 <table className="table table-xs">
       //                     <thead>
       //                     <tr>
       //                         <th/>
       //                         <th>Order #</th>
       //                         <th>User</th>
       //                         <th>Order date</th>
       //                         <th>Total (USD)</th>
       //                         <th>Paid</th>
       //                         <th>Shipped</th>
       //                         <th>Delivered</th>
       //                     </tr>
       //                     </thead>
       //                     <tbody>
       //                     {
       //                         localData && (
       //                             localData.map(function(order, index) {
       //                                 return (
       //                                     <tr className={"hover"} key={index}>
       //                                         <th>{index+1}</th>
       //                                         <td>{order._id}</td>
       //                                         <td>{order.user?.name}</td>
       //                                         <td>{order.createdAt.substring(0, 10)}</td>
       //                                         <td>${order.totalPrice}</td>
       //                                         <td>{order.isPaid ? order.paidAt.substring(0,10) : <FaTimes fill={"red"}/>}</td>
       //                                         <td>{order.isPaid ? order.paidAt.substring(0,10) : <FaTimes fill={"red"}/>}</td>
       //                                         <td>{order.isDelivered ? order.deliveredAt.substring(0,10) : <FaTimes fill={"red"}/>}</td>
       //                                         <td>
       //                                             <Link className={"btn btn-xs normal-case"} to={`/order/${order._id}`}>
       //                                                 Details
       //                                             </Link>
       //                                         </td>
       //                                     </tr>
       //                                 )
       //                             })
       //                         )
       //
       //                     }
       //                     </tbody>
       //                     <tfoot>
       //                     </tfoot>
       //                 </table>
       //             </div>
       //         </div>
       //     </div>
       )
    );
};

export default AdminOrderListPage;