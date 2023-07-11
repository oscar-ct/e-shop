import React, {useEffect, useState} from 'react';
import {useGetOrdersQuery} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import {FaTimes} from "react-icons/fa";
import {Link} from "react-router-dom";

const AdminOrderListPage = () => {


    const {data: orders, isLoading, error} = useGetOrdersQuery();
    const [localData, setLocalData] = useState(null);

    useEffect(function () {
        if (orders) {
            if (!localData) {
                setLocalData(orders);
            }
        }
    }, [orders, localData]);


    return (
       isLoading ? <Spinner/> : error ? error : (
           <div className={"pt-10"}>

               <div className={"card bg-base-100 shadow-xl"}>
                   <h3 className={"text-2xl font-bold text-center pt-5"}>Orders</h3>
                   <div className="overflow-x-auto p-5">
                       <table className="table table-xs">
                           <thead>
                           <tr>
                               <th/>
                               <th>Order #</th>
                               <th>User</th>
                               <th>Order date</th>
                               <th>Total (USD)</th>
                               <th>Paid</th>
                               <th>Shipped</th>
                               <th>Delivered</th>
                           </tr>
                           </thead>
                           <tbody>
                           {
                               localData && (
                                   localData.map(function(order, index) {
                                       return (
                                           <tr className={"hover"} key={index}>
                                               <th>{index+1}</th>
                                               <td>{order._id}</td>
                                               <td>{order.user?.name}</td>
                                               <td>{order.createdAt.substring(0, 10)}</td>
                                               <td>${order.totalPrice}</td>
                                               <td>{order.isPaid ? order.paidAt.substring(0,10) : <FaTimes fill={"red"}/>}</td>
                                               <td>{order.isPaid ? order.paidAt.substring(0,10) : <FaTimes fill={"red"}/>}</td>
                                               <td>{order.isDelivered ? order.deliveredAt.substring(0,10) : <FaTimes fill={"red"}/>}</td>
                                               <td>
                                                   <Link className={"btn btn-xs normal-case"} to={`/order/${order._id}`}>
                                                       Details
                                                   </Link>
                                               </td>
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
       )
    );
};

export default AdminOrderListPage;