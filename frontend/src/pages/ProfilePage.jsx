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
                    <div className={"pt-10 flex justify-center"}>
                        <div className={"grow max-w-[72rem] flex flex-col"}>
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
                                        <div className="mt-5 mb-10">
                                            {
                                                orders.map(function (order, index) {
                                                    return <ProfileOrderItem refetch={refetch} key={index} order={order} index={index} orderLength={orders.length}/>
                                                })
                                            }
                                        </div>

                                    ) : (
                                        <h1 className={"mt-5 text-2xl font-bold text-center"}>No Orders Found</h1>
                                    )
                                ) : (
                                    <div className="mt-5 mb-10 w-full h-full flex flex-col lg:flex-row justify-between items-start">
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