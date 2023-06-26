import {PRODUCTS_URL} from "../variables";
import {apiSlice} from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: function (build) {
        return {
            getProducts: build.query({
                query: function () {
                    return {
                        url: PRODUCTS_URL
                    }
                },
                // 5 seconds
                keepUnusedDataFor: 5
            }),
            getProductDetails: build.query({
                query: function (id) {
                    return {
                        url: `${PRODUCTS_URL}/${id}`
                    }
                },
                // 5 seconds
                keepUnusedDataFor: 5
                }
            )
        };
    }
});

export const { useGetProductsQuery, useGetProductDetailsQuery } = productsApiSlice;