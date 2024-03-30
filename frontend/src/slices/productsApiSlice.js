import {DISCOUNT_URL, PRODUCTS_URL} from "../variables";
import {apiSlice} from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: function (build) {
        return {
            getProducts: build.query({
                query: function ({searchTerm, pageNumber, sortByTerm, filterTerm}) {
                    return {
                        url: PRODUCTS_URL,
                        params: {
                            searchTerm,
                            pageNumber,
                            sortByTerm,
                            filterTerm,
                        }
                    }
                },
                // 5 seconds
                providesTags: ["Products"],
                keepUnusedDataFor: 5
            }),
            getProductsByAdmin: build.query({
                query: function ({searchTerm, pageNumber}) {
                    return {
                        url: `${PRODUCTS_URL}/admin`,
                        params: {
                            searchTerm,
                            pageNumber,
                        }
                    }
                },
                providesTags: ["Products"],
                keepUnusedDataFor: 5
            }),
            getProductDetails: build.query({
                query: function (id) {
                    return {
                        url: `${PRODUCTS_URL}/product/${id}`
                    }
                },
                providesTags: ["Product"],
                keepUnusedDataFor: 5
            }),
            createProduct: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}`,
                            method: "POST",
                            body: data,
                        }
                    },
                    // this will allow the created product to show with reloading page, clears cache
                    invalidatesTags: ["Products"],
                }
            ),
            updateProduct: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}/product/${data.productId}`,
                            method: "PUT",
                            body: data,
                        }
                    },
                // this will allow the created product to show with reloading page, clears cache
                    invalidatesTags: ["Product", "Products"],
                }
            ),
            updateProductImages: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}/product/${data.productId}/images`,
                            method: "PUT",
                            body: data,
                        }
                    },
                }
            ),
            deleteProduct: build.mutation({
                    query: function (id) {
                        return {
                            url: `${PRODUCTS_URL}/product/${id}`,
                            method: "DELETE"
                        }
                    },
                    invalidatesTags: ["Products"],
                }
            ),
            deleteProductImage: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}/product/${data.productId}/images`,
                            method: "DELETE",
                            body: data,
                        }
                    },
                }
            ),
            createReview: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}/product/${data.productId}/reviews`,
                            method: "POST",
                            body: data,
                        }
                    },
                }
            ),
            deleteReview: build.mutation({
                    query: function (data) {
                        return {
                            url: `${PRODUCTS_URL}/product/${data.productId}/reviews`,
                            method: "DELETE",
                            body: data,
                        }
                    },
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
            getProductsByCategory: build.query({
                    query: function () {
                        return {
                            url: `${PRODUCTS_URL}/categories`
                        }
                    },
                    // 5 seconds
                    keepUnusedDataFor: 5
                }
            ),
        };
    }
});

export const { useGetProductsQuery, useGetProductsByAdminQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateProductMutation, useUpdateProductImagesMutation, useDeleteProductMutation, useDeleteProductImageMutation, useCreateReviewMutation, useDeleteReviewMutation, useGetProductsByRatingQuery, useValidateDiscountCodeMutation, useGetProductsByCategoryQuery} = productsApiSlice;