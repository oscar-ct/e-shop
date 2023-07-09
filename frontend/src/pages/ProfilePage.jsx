import {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import {useUpdateUserCredentialsMutation} from "../slices/usersApiSlice";
import {useGetMyOrdersQuery} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import {setCredentials} from "../slices/authSlice";
import {setLoading} from "../slices/loadingSlice";
import ProfileOrderItem from "../components/ProfileOrderItem";




const ProfilePage = () => {

    const { id } = useParams();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const {userData} = useSelector(function(state) {
        return state.auth;
    });
    const [updateUserCredentials] = useUpdateUserCredentialsMutation();
    const {data: orders, isLoading, error} = useGetMyOrdersQuery();
    const dispatch = useDispatch();


    useEffect(function() {
        if (userData) {
            setName(userData.name);
            setEmail(userData.email);
        }
    }, [userData, userData.name, userData.email]);

    const submitPasswordHandler = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            console.log("Passwords do not match");
            setErrorMessage("Passwords do not match");
        } else {
            dispatch(setLoading(true));
            try {
                const data = await updateUserCredentials({
                    _id: userData._id,
                    name: name,
                    email: email,
                    password: password,
                }).unwrap();
                dispatch(setCredentials(data));
                dispatch(setLoading(false));
            } catch (e) {
                console.log(e);
                dispatch(setLoading(false))
            }
        }
    }

    const submitAccountHandler = async () => {

    }

    return (
        isLoading ? <Spinner/> :  (
            <div className={"flex justify-center"}>
                <div className={"grow max-w-[72rem] flex flex-col lg:flex-row pt-10"}>

                    <div className={"card bg-base-100/0 h-full w-full"}>
                        <div className={"p-5 flex justify-center"}>
                            <div className="tabs tabs-boxed">
                                <Link
                                    to={"/profile/account"}
                                     className={`tab ${id === "account" && "tab-active"}`}>
                                    Account
                                </Link>
                                <Link
                                    to={"/profile/orders"}
                                    className={`tab ${id === "orders" && "tab-active"}`}>
                                    Your Orders ({orders.length})
                                </Link>
                            </div>
                        </div>

                        {
                            id === "orders" ? (
                                orders.map(function (order, index) {
                                    return <ProfileOrderItem key={index} order={order}/>
                                })
                            ) : id === "account" ? (

                                <>

                                        <div className="mt-5 w-full h-full flex flex-col lg:flex-row justify-between">



                                                <div className="bg-base-100 shadow-xl p-12 mx-auto rounded-2xl sm:w-96 w-full">
                                                    <div className="mb-4">
                                                        <h3 className="font-semibold text-2xl text-gray-800">Account Details
                                                        </h3>
                                                    </div>
                                                    <form className="space-y-5">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700 tracking-wide">Name
                                                            </label>
                                                            <input
                                                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                                autoComplete={"name"}
                                                                type={"name"}
                                                                id={"name"}
                                                                value={name}
                                                                onChange={(e) => {setName(e.target.value)}}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700 tracking-wide">Email
                                                            </label>
                                                            <input
                                                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                                autoComplete={"email"}
                                                                type={"email"}
                                                                id={"email"}
                                                                value={email}
                                                                onChange={(e) => {setEmail(e.target.value)}}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                                                                Current password
                                                            </label>

                                                            <input
                                                                className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                                autoComplete={"current-password"}
                                                                type={"password"}
                                                                placeholder={"Enter your password"}
                                                                id={"password"}
                                                                onChange={(e) => {setPassword(e.target.value)}}
                                                                value={password}
                                                                required
                                                            />
                                                        </div>
                                                        {/*{*/}
                                                        {/*    invalidLogin && (*/}
                                                        {/*        <div className={"flex justify-center"}>*/}
                                                        {/*            <span className={"text-red-500 font-bold"}>{errorMessage}</span>*/}
                                                        {/*        </div>*/}
                                                        {/*    )*/}
                                                        {/*}*/}

                                                        <div className={"pt-3 flex justify-center"}>
                                                            <button disabled={password === ""} type="submit" className="btn btn-wide btn-primary">
                                                                Update
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>


                                                <div className="bg-base-100 shadow-xl p-12 mx-auto rounded-2xl sm:w-96 w-full">
                                                    <div className="mb-4">
                                                        <h3 className="font-semibold text-2xl text-gray-800">Change Password
                                                        </h3>
                                                    </div>
                                                    <form className="space-y-5">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700 tracking-wide">Current password
                                                            </label>
                                                            <input
                                                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                                autoComplete={"password"}
                                                                placeholder={"Current password"}
                                                                type={"password"}
                                                                id={"current-password"}
                                                                value={currentPassword}
                                                                onChange={(e) => {setCurrentPassword(e.target.value)}}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700 tracking-wide">
                                                                New password
                                                            </label>
                                                            <input
                                                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                                autoComplete={"password"}
                                                                placeholder={"New password"}
                                                                type={"password"}
                                                                id={"new-password"}
                                                                value={newPassword}
                                                                onChange={(e) => {setNewPassword(e.target.value)}}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                                                                Confirm new password
                                                            </label>

                                                            <input
                                                                className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                                autoComplete={"password"}
                                                                type={"password"}
                                                                placeholder={"Confirm password"}
                                                                id={"confirm-password"}
                                                                onChange={(e) => {setConfirmPassword(e.target.value)}}
                                                                value={confirmPassword}
                                                                required
                                                            />
                                                        </div>
                                                        {/*{*/}
                                                        {/*    invalidLogin && (*/}
                                                        {/*        <div className={"flex justify-center"}>*/}
                                                        {/*            <span className={"text-red-500 font-bold"}>{errorMessage}</span>*/}
                                                        {/*        </div>*/}
                                                        {/*    )*/}
                                                        {/*}*/}

                                                        <div className={"pt-3 flex justify-center"}>
                                                            <button disabled type="submit" className="btn btn-wide btn-primary">
                                                                Update
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>



                                        </div>

                                </>

                            ) : (
                                <>ERROR</>
                            )
                        }


                    </div>
                </div>
            </div>
        )
    );
};

export default ProfilePage;