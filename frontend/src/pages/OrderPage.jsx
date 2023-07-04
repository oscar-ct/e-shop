import React from 'react';
import {useParams} from "react-router-dom";
import {useGetMyOrderByIdQuery} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";

const OrderPage = () => {

    const { id: orderId } = useParams();
    const {data, refetch, isLoading, error} = useGetMyOrderByIdQuery(orderId);

    console.log(data);

    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <div className={"mt-5"}>
                        <Message variant={"error"}>{error.data.message}</Message>
                    </div>

                ) : (
                    <>

                    </>
                )
            }
        </>
    );
};

export default OrderPage;