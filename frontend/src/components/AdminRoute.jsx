import React from 'react';
import {Outlet, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const AdminRoute = () => {

    const {userData} = useSelector(function (state) {
        return state.auth;
    });

    return (
        userData && userData.isAdmin ? (
            <Outlet/>
        ) : (
            <Navigate to={"/login"} replace/>
        )
    );
};

export default AdminRoute;