import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userData: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: function (state, action) {
            state.userData = action.payload;
            localStorage.setItem("userData", JSON.stringify(action.payload));
        },
        logout: function (state) {
            state.userData = null;
            localStorage.removeItem("userData");
            // localStorage.removeItem("cart");
        },
        // updateShippingData: function (state, action) {
        //     state.userData.shippingAddresses = action.payload;
        //     localStorage.setItem("userData", JSON.stringify(action.payload));
        // }
    },

});

export const {setCredentials,
    // updateShippingData,
    logout} = authSlice.actions;

export default authSlice.reducer;