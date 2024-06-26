import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {BASE_URL} from "../variables";

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["Products", "Product", "Order", "User"],
    endpoints() {
        return {}
    }
});