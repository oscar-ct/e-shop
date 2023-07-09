import React from 'react';
import ProductOrderItemProduct from "./ProductOrderItemProduct";
import {Link} from "react-router-dom";
import Message from "./Message";

const ProfileOrderItem = ({order}) => {
    return (
        <div className={" px-3 sm:px-8 lg:px-14 py-5"}>
            <div className={"rounded-xl bg-base-100 shadow-xl w-full flex flex-col"}>
                <div className={"p-5 rounded-tr-xl rounded-tl-xl flex flex-col md:flex-row bg-base-300"}>
                    <div className={"w-full md:w-6/12 flex justify-start"}>
                        <div className={"flex flex-col"}>
                            <span className={"text-xs font-bold"}>
                                ORDER PLACED
                            </span>
                            <span className={"text-sm"}>
                                {order.createdAt.substring(0, 10)}
                            </span>
                        </div>
                        <div className={"flex flex-col px-10"}>
                            <span className={"text-xs font-bold"}>
                                TOTAL
                            </span>
                            <span className={"text-sm"}>
                                {order.totalPrice}
                            </span>
                        </div>
                        <div className={"flex flex-col"}>
                            <span className={"text-xs font-bold"}>
                                SHIP TO
                            </span>
                            <span className={"link link-primary text-sm"}>
                                {order.user.name}
                            </span>
                        </div>
                    </div>
                    <div className={"w-full pt-3 md:pt-0 md:w-6/12 flex md:justify-end"}>
                        <div className={"flex flex-col"}>
                            <span className={"text-xs font-bold"}>
                                Order # {order._id}
                            </span>
                            <Link to={`/order/${order._id}`} className={"link link-primary text-sm"}>
                                View order details
                            </Link>
                        </div>
                    </div>
                </div>


                    {
                        !order.isPaid && (
                            <div className={"pt-3 px-5"}>
                                <div className={"w-full lg:w-6/12"}>
                                    <Message variant={"error"}>
                                        Awaiting payment, please pay now
                                        <Link
                                            to={`/order/${order._id}`}
                                            className={"ml-2 btn btn-xs"}
                                        >
                                            Pay
                                        </Link>
                                    </Message>
                                </div>
                            </div>
                        )
                    }



                        {
                            order.orderItems.map(function (product, index) {
                                return (
                                    <>
                                        {
                                            order.isPaid && order.isDelivered ? (
                                                <div className={"pt-5 px-8"}>
                                                    <span className={"text-2xl text-green-600 font-bold"}>
                                                        Delivered
                                                    </span>
                                                </div>
                                            ) : order.isPaid && !order.isDelivered ? (
                                                <div className={"pt-5 px-8"}>
                                                    <span className={"text-2xl font-bold"}>
                                                        On the way
                                                    </span>
                                                </div>
                                            ) : (
                                                ""
                                            )
                                        }
                                        <ProductOrderItemProduct product={product} key={product._id} index={index} orderSize={order.orderItems.length}/>
                                    </>

                                )
                            })
                        }

            </div>
        </div>
    );
};

export default ProfileOrderItem;