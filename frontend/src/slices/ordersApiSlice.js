import {ORDERS_URL, PAYPAL_URL} from "../variables";
import {apiSlice} from "./apiSlice";


export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: function (build) {
        return {
            verifyAmount: build.mutation({
                query: function (data) {
                    return {
                        url:`${ORDERS_URL}/verifyamount`,
                        method: "POST",
                        body: {...data},
                    }
                },
            }),
            createOrder: build.mutation({
                query: function (data) {
                    return {
                        url: ORDERS_URL,
                        method: "POST",
                        body: {...data},
                    }
                },
            }),
            getMyOrders: build.query({
                    query: function () {
                        return {
                            url: `${ORDERS_URL}/myorders`
                        }
                    },
                    // 5 seconds
                    keepUnusedDataFor: 5
                }
            ),
            getOrderById: build.query({
                    query: function (id) {
                        return {
                            url: `${ORDERS_URL}/${id}`
                        }
                    },
                    // 5 seconds
                    keepUnusedDataFor: 5,
                    providesTags: ["Order"],
                }
            ),
            payOrder: build.mutation({
                query: function (data) {
                    return {
                        url: `${ORDERS_URL}/${data.orderId}/payment`,
                        method: "PUT",
                        body: data,
                    }
                },
                invalidatesTags: ["Order"],
            }),
            getPayPalClientId: build.query({
                    query: function () {
                        return {
                            url: PAYPAL_URL
                        }
                    },
                    // 5 seconds
                    keepUnusedDataFor: 5
                }
            ),
            getOrders: build.query({
                    query: function () {
                        return {
                            url: `${ORDERS_URL}`
                        }
                    },
                    // 5 seconds
                    keepUnusedDataFor: 5,
                    providesTags: ["Order"],
                }
            ),
            updateOrder: build.mutation({
                    query: function (data) {
                        return {
                            url: `${ORDERS_URL}/${data.orderId}/update`,
                            method: "PUT",
                            body: data,
                        }
                    },
                    invalidatesTags: ["Order"]
                }
            ),
            cancelOrder: build.mutation({
                    query: function (id) {
                        return {
                            url: `${ORDERS_URL}/${id}/cancelorder`,
                            method: "PUT",
                        }
                    },
                    invalidatesTags: ["Order"]
                }
            ),
            cancelOrderItem: build.mutation({
                    query: function (data) {
                        return {
                            url: `${ORDERS_URL}/${data.orderId}/cancelitem`,
                            method: "PUT",
                            body: data,
                        }
                    },
                    invalidatesTags: ["Order"]
                }
            ),
        };
    }
});

export const { useVerifyAmountMutation, useCreateOrderMutation, useGetMyOrdersQuery, useGetOrderByIdQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useGetOrdersQuery, useUpdateOrderMutation, useCancelOrderMutation, useCancelOrderItemMutation } = ordersApiSlice;