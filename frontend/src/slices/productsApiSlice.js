import {DISCOUNT_URL, PRODUCTS_URL} from "../variables";
import {apiSlice} from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: function (build) {
        return {
            getProducts: build.query({
                query: function ({searchTerm, pageNumber, sortByTerm}) {
                    return {
                        url: PRODUCTS_URL,
                        params: {
                            searchTerm,
                            pageNumber,
                            sortByTerm,
                        }
                    }
                },
                // 5 seconds
                providesTags: ["Product"],
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
            ),
            createProduct: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}`,
                            method: "POST",
                            body: data,
                        }
                    },
                    // this will allow the created product to show with reloading page, clears cache
                    invalidatesTags: ["Product"],
                }
            ),
            updateProduct: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}/${data.productId}`,
                            method: "PUT",
                            body: data,
                        }
                    },
                // this will allow the created product to show with reloading page, clears cache
                    invalidatesTags: ["Product"],
                }
            ),
            updateProductImages: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}/${data.productId}/images`,
                            method: "PUT",
                            body: data,
                        }
                    },
                    // this will allow the created product to show with reloading page, clears cache
                    invalidatesTags: ["Product"],
                }
            ),
            deleteProduct: build.mutation({
                    query: function (id) {
                        return {
                            url: `${PRODUCTS_URL}/${id}`,
                            method: "DELETE"
                        }
                    },
                }
            ),
            deleteProductImage: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}/${data.productId}/images`,
                            method: "DELETE",
                            body: data,
                        }
                    },
                }
            ),
            createReview: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                            method: "POST",
                            body: data,
                        }
                    },
                invalidatesTags: ["Product"],
                }
            ),
            getProductsByRating: build.query({
                    query: function () {
                        return {
                            url: `${PRODUCTS_URL}/top`
                        }
                    },
                    // 5 seconds
                    keepUnusedDataFor: 5
                }
            ),
            validateDiscountCode: build.mutation({
                    query: function (data) {
                        return {
                            url: DISCOUNT_URL,
                            method: "POST",
                            body: data,
                        }
                    },
                }
            ),
        };
    }
});

export const { useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateProductMutation, useUpdateProductImagesMutation, useDeleteProductMutation, useDeleteProductImageMutation, useCreateReviewMutation, useGetProductsByRatingQuery, useValidateDiscountCodeMutation} = productsApiSlice;