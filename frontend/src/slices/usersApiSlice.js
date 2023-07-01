import {USERS_URL} from "../variables";
import {apiSlice} from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: function (build) {
        return {
            login: build.mutation({ // mutation is required for POST requests
                query: function (data) {  // passing in data i.e. email, password
                    return {
                        url: USERS_URL + "/login",
                        method: "POST",
                        body: data,
                    }
                },
            }),
            register: build.mutation({ // mutation is required for POST requests
                query: function (data) {  // passing in data i.e. email, password
                    return {
                        url: USERS_URL,
                        method: "POST",
                        body: data,
                    }
                },
            }),
            logout: build.mutation({
                query: function () {
                    return {
                        url: USERS_URL + "/logout",
                        method: "POST",
                    }
                }
            }),
        };
    }
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation} = usersApiSlice;