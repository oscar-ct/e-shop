import {Link, useNavigate, useParams} from "react-router-dom"
import {useGetMyOrdersQuery} from "../slices/ordersApiSlice";
import {useCancelOrderItemMutation, useCancelOrderMutation} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import ProfileOrderItem from "../components/ProfileOrderItem";
import ProfileAccountDetails from "../components/ProfileAccountDetails";
import ProfileAccountPassword from "../components/ProfileAccountPassword";
import NotFoundPage from "./NotFoundPage";
import Meta from "../components/Meta";
import ConfirmModal from "../components/ConfirmModal";
import {useDispatch, useSelector} from "react-redux";
import BackButton from "../components/BackButton";
import Message from "../components/Message";
import {useEffect} from "react";
import {clearCartItems} from "../slices/cartSlice";
import {logout} from "../slices/authSlice";
import {useLogoutMutation} from "../slices/usersApiSlice";


const ProfilePage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();
    const {id: params} = useParams();
    const {data: orders, isLoading, error, refetch} = useGetMyOrdersQuery();

    useEffect(function () {
        const logoutUser = async () => {
            await logoutApiCall().unwrap();
            navigate("/login");
            dispatch(clearCartItems());
            dispatch(logout());
        }
        if (error) {
            setTimeout(() => {
                logoutUser();
            }, 1000);
        }
    }, [error, dispatch, navigate, logoutApiCall]);

    const {order} = useSelector(function (state) {
        return state.order;
    });
    const [cancelOrder,
        // {error: errorCancelOrder}
    ] = useCancelOrderMutation();
    const [cancelOrderItem,
        // {error: errorCancelOrderItem}
    ] = useCancelOrderItemMutation();

    const submitCancel = async () => {
       if (order) {
           if (order.orderItemsLength === 1 && !order.isCanceled) {
               await cancelOrder(order._id);
               refetch();
           } else {
               const data = {
                   orderId: order._id,
                   productId: order.productId,
               }
               await cancelOrderItem(data);
               refetch();
           }
       }
    };

    return (

        params === "orders" || params === "account" ? (
            isLoading ? (
                <Spinner/>
            ) : error ? (
                    <div className={"pt-10 px-2"}>
                        <BackButton/>
                        <Message variant={"error"}>
                            {error?.data?.message || error.error}
                        </Message>
                    </div>
                ) : (
                    <>
                        <Meta title={`${params === "orders" ? "My Orders" : "Account"}`}/>
                        <div className={"pt-10 flex justify-center"}>
                            <div className={"grow max-w-[72rem] flex flex-col"}>
                                <div className={"pb-5 flex justify-center"}>
                                    <div className="bg-zinc-100 tabs tabs-boxed">
                                        <Link
                                            to={"/profile/account"}
                                            className={`tab ${params === "account" ? "tab-active" : "text-black"}`}>
                                            Account
                                        </Link>
                                        <Link
                                            to={"/profile/orders"}
                                            className={`tab ${params === "orders" ? "tab-active" : "text-black"}`}>
                                            Your Orders ({orders.length})
                                        </Link>
                                    </div>
                                </div>
                                {
                                    params === "orders" ? (
                                        orders.length > 0 ? (
                                            <div className="mt-5 mb-10">
                                                {
                                                    orders.map(function (order, index) {
                                                        return <ProfileOrderItem key={index} order={order} index={index} orderLength={orders.length}/>
                                                    })
                                                }
                                            </div>

                                        ) : (
                                            <h1 className={"mt-5 text-2xl font-bold text-center"}>No Orders Found</h1>
                                        )
                                    ) : (
                                        <div className="mt-5 mb-10 w-full h-full flex flex-col">
                                            <div className={"w-full flex flex-col lg:flex-row justify-between items-start"}>
                                                <ProfileAccountDetails/>
                                                <ProfileAccountPassword/>
                                            </div>
                                            {/*<div className={"w-full pt-10"}>*/}
                                            {/*    <ProfileAccountSavedAddresses/>*/}
                                            {/*</div>*/}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <ConfirmModal title={"Are you sure you want to cancel? This cannot be undone."} initiateFunction={submitCancel}/>
                    </>
                )
        ) : <NotFoundPage/>

    );
};

export default ProfilePage;