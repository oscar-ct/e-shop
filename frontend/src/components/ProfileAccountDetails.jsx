import {setLoading} from "../slices/loadingSlice";
import {logout, setCredentials} from "../slices/authSlice";
import {useUpdateUserCredentialsMutation, useVerifyPasswordMutation} from "../slices/usersApiSlice";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {toast} from "react-hot-toast";
import {clearCartItems} from "../slices/cartSlice";
import {useNavigate} from "react-router-dom";
import {useLogoutMutation} from "../slices/usersApiSlice";
import CustomBtn from "./CustomBtn";


const ProfileAccountDetails = () => {

    const {userData} = useSelector(function(state) {
        return state.auth;
    });

    const [name, setName] = useState(userData?.name);
    const [email, setEmail] = useState(userData?.email);
    const [password, setPassword] = useState("");
    // const [errorMessage, setErrorMessage] = useState(null);
    // const [successMessage, setSuccessMessage] = useState(null);

    const [updateUserCredentials] = useUpdateUserCredentialsMutation();
    const [verifyPassword] = useVerifyPasswordMutation();
    const [logoutApiCall] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const clearPasswordFields = () => {
        setPassword("");
    };

    const logoutUser = async () => {
        await logoutApiCall().unwrap();
        navigate("/login");
        dispatch(clearCartItems());
        dispatch(logout());
    };

    const submitAccountHandler = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const {passwordVerified} = await verifyPassword({
                password: password,
            }).unwrap();
            if (passwordVerified) {
                try {
                    const user = await updateUserCredentials({
                        name: name,
                        email: email,
                    });
                    if (user) {
                        dispatch(setCredentials(user.data));
                        toast.success("Account updated");
                        // setSuccessMessage("Account details updated!");
                        dispatch(setLoading(false));
                    } else {
                        toast.error("Something went wrong, try again later");
                        // setErrorMessage("Something went wrong, try again later");
                        dispatch(setLoading(false));

                    }
                } catch (e) {
                    toast.error(e.message);
                    // setErrorMessage(e.message);
                    dispatch(setLoading(false));
                }
            } else {
                toast.error("Invalid Password");
                // setErrorMessage("Invalid Password");
                dispatch(setLoading(false));
            }
        } catch (e) {
            toast.error(e.data.message);
            // setErrorMessage(e.message);
            dispatch(setLoading(false));
            setTimeout(() => {
                logoutUser();
            }, 1000);
        }
        clearPasswordFields();
    };


    return (
        <div className=" md:pt-4 bg-white mx-auto sm:w-96 w-full">
            <div className="py-2 md:bg-zinc-700">
                <h3 className="lg:pl-3 text-2xl md:text-2xl md:text-white ibmplex text-center">Account Holder
                </h3>
            </div>
            <div className={"border"}>
                <div className={"px-12 pb-12 pt-4"}>
                    <form onSubmit={submitAccountHandler} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 tracking-wide">Name
                            </label>
                            <input
                                className="bg-white w-full text-base px-4 py-2 border  border-gray-300 focus:outline-none focus:border-blue-400"
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
                                className="bg-white w-full text-base px-4 py-2 border  border-gray-300 focus:outline-none focus:border-blue-400"
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
                                className="bg-white w-full content-center text-base px-4 py-2 border  border-gray-300 focus:outline-none focus:border-blue-400"
                                autoComplete={"current-password"}
                                type={"password"}
                                placeholder={"Enter your password"}
                                id={"password"}
                                onChange={(e) => {setPassword(e.target.value)}}
                                value={password}
                                required
                            />
                        </div>
                        {/*<div className={"flex justify-center items-center h-5 text-lg"}>*/}
                        {/*    {*/}
                        {/*        errorMessage && (*/}
                        {/*            <span className={"text-red-500 font-bold"}>*/}
                        {/*                {errorMessage}*/}
                        {/*            </span>*/}

                        {/*        )*/}
                        {/*    }*/}
                        {/*    {*/}
                        {/*        successMessage && (*/}
                        {/*            <span className={"text-green-500 font-bold"}>*/}
                        {/*                {successMessage}*/}
                        {/*            </span>*/}
                        {/*        )*/}
                        {/*    }*/}
                        {/*</div>*/}
                        <div className={"pt-8 flex justify-center"}>
                            <CustomBtn isDisabled={(userData.name === name.trim() && userData.email === email.trim())} type={"submit"} customClass={"btn-wide"}>
                                Update
                            </CustomBtn>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileAccountDetails;