import {Outlet, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const PrivateRoute = () => {

    const {userData} = useSelector(function (state) {
        return state.auth;
    });

    return (
        userData ? (
            <Outlet/>
            ) : (
            <Navigate to={"/login"} replace/>
        )
    );
};

export default PrivateRoute;