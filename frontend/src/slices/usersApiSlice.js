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
            verifyPassword: build.mutation({ // mutation is required for POST requests
                query: function (data) {  // passing in data i.e. email, password
                    return {
                        url: USERS_URL + "/profile",
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
            getUserData: build.query({
                query: function () {
                    return {
                        url: USERS_URL + "/profile",
                    }
                }
            }),
            updateUserAddress: build.mutation({
                    query: function (data) {
                        return {
                            url: USERS_URL + "/profile/address",
                            method: "PUT",
                            body: data,
                        }
                    }
            }),
            updateUserCredentials: build.mutation({
                query: function (data) {
                    return {
                        url: USERS_URL + "/profile",
                        method: "PUT",
                        body: data,
                    }
                }
            }),
            getUsers: build.query({
                query: function () {
                    return {
                        url: USERS_URL,
                    }
                },
                keepUnusedDataFor: 5
            }),
            // getUserById: build.query({
            //     query: function (id) {
            //         return {
            //             url: USERS_URL + "/" + id,
            //         }
            //     },
            //     keepUnusedDataFor: 5
            // }),
            deleteUser: build.mutation({
                query: function (id) {
                    return {
                        url: USERS_URL + "/" + id,
                        method: "DELETE",
                    }
                }
            }),
            updateUser: build.mutation({
                query: function (data) {
                    return {
                        url: USERS_URL + "/" + data._id,
                        method: "PUT",
                        body: data,
                    }
                }
            }),
        };
    }
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useVerifyPasswordMutation, useGetUserDataQuery, useUpdateUserAddressMutation, useUpdateUserCredentialsMutation, useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation} = usersApiSlice;