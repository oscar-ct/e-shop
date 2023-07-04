import {ORDERS_URL} from "../variables";
import {apiSlice} from "./apiSlice";


export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: function (build) {
        return {
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
            getMyOrderById: build.query({
                    query: function (id) {
                        return {
                            url: `${ORDERS_URL}/myorders/${id}`
                        }
                    },
                    // 5 seconds
                    keepUnusedDataFor: 5
                }
            ),

        };
    }
});

export const { useCreateOrderMutation, useGetMyOrdersQuery, useGetMyOrderByIdQuery } = ordersApiSlice;