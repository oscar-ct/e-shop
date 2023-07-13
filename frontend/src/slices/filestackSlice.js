import {FILESTACK_URL} from "../variables";
import {apiSlice} from "./apiSlice";

export const filestackApiSlice = apiSlice.injectEndpoints({
    endpoints: function (build) {
        return {
            getFilestackToken: build.query({
                    query: function () {
                        return {
                            url: `${FILESTACK_URL}/token`
                        }
                    },
                    // 5 seconds
                    keepUnusedDataFor: 5
                }
            ),
            encodeHandle: build.mutation({
                    query: function (data) {
                        return {
                            url: `${FILESTACK_URL}/handle`,
                            method: "POST",
                            body: data,
                        }
                    },
                }
            ),
        };
    }
});

export const { useGetFilestackTokenQuery, useEncodeHandleMutation} = filestackApiSlice;