import {Link, useParams} from "react-router-dom"
import {useGetMyOrdersQuery} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import ProfileOrderItem from "../components/ProfileOrderItem";
import ProfileAccountDetails from "../components/ProfileAccountDetails";
import ProfileAccountPassword from "../components/ProfileAccountPassword";




const ProfilePage = () => {

    const {id: params} = useParams();
    const {data: orders, isLoading, refetch} = useGetMyOrdersQuery();

    return (

        params === "orders" || params === "account" ? (
            isLoading ?
                <Spinner/>
                : (
                    <div className={"flex justify-center"}>
                        <div className={"grow max-w-[72rem] my-10 flex flex-col"}>
                            <div className={"pb-5 flex justify-center"}>
                                <div className="tabs tabs-boxed">
                                    <Link
                                        to={"/profile/account"}
                                        className={`tab ${params === "account" && "tab-active"}`}>
                                        Account
                                    </Link>
                                    <Link
                                        to={"/profile/orders"}
                                        className={`tab ${params === "orders" && "tab-active"}`}>
                                        Your Orders ({orders.length})
                                    </Link>
                                </div>
                            </div>
                            {
                                params === "orders" ? (
                                    orders.length > 0 ? (
                                        orders.map(function (order, index) {
                                            return <ProfileOrderItem refetch={refetch} key={index} order={order}/>
                                        })
                                    ) : (
                                        <h1>No Orders</h1>
                                    )
                                ) : (
                                    <div className="mt-5 w-full h-full flex flex-col lg:flex-row justify-between items-start">
                                        <ProfileAccountDetails/>
                                        <ProfileAccountPassword/>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
        ) : "Error Page"

    );
};

export default ProfilePage;