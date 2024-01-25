import {useState} from "react";
import {useLogoutMutation, useUpdateUserCredentialsMutation, useVerifyPasswordMutation} from "../slices/usersApiSlice";
import {useDispatch} from "react-redux";
import {setLoading} from "../slices/loadingSlice";
import {toast} from "react-hot-toast";
import {clearCartItems} from "../slices/cartSlice";
import {logout} from "../slices/authSlice";
import {useNavigate} from "react-router-dom";


const ProfileAccountPassword = () => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [errorMessage2, setErrorMessage2] = useState(null);
    // const [successMessage2, setSuccessMessage2] = useState(null);

    const [updateUserCredentials] = useUpdateUserCredentialsMutation();
    const [verifyPassword] = useVerifyPasswordMutation();
    const [logoutApiCall] = useLogoutMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const clearPasswordFields = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    // useEffect(function() {
    //     if (errorMessage2 || successMessage2) {
    //         setTimeout(function () {
    //             setErrorMessage2(null);
    //             setSuccessMessage2(null);
    //         }, 3000)
    //     }
    //
    // }, [errorMessage2, successMessage2]);

    const logoutUser = async () => {
        await logoutApiCall().unwrap();
        navigate("/login");
        dispatch(clearCartItems());
        dispatch(logout());
    };

    const submitPasswordHandler = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match")
            // setErrorMessage2("New passwords do not match!");
        } else {
            dispatch(setLoading(true));
            try {
                const {passwordVerified} = await verifyPassword({
                    password: currentPassword,
                }).unwrap();
                if (passwordVerified) {
                    try {
                        const user = await updateUserCredentials({
                            newPassword: newPassword
                        });
                        if (user) {
                            toast.success("Password updated!");
                            // setSuccessMessage2("Password updated!");
                            dispatch(setLoading(false));
                        } else {
                            toast.error("Something went wrong, try again later");
                            // setErrorMessage2("Something went wrong, try again later");
                            dispatch(setLoading(false));
                        }

                    } catch (e) {
                        toast.error(e);
                        // setErrorMessage2(e);
                        dispatch(setLoading(false));
                    }
                } else {
                    toast.error("Invalid password");
                    // setErrorMessage2("Invalid password");
                    dispatch(setLoading(false));
                }
            } catch (e) {
                toast.error(e.data.message);
                // setErrorMessage2(e);
                dispatch(setLoading(false));
                setTimeout(() => {
                    logoutUser();
                }, 1000);
            }
        }
        clearPasswordFields();
    };

    return (
        <div className="md:pt-4 bg-white mx-auto sm:w-96 w-full">
            <div className="py-2 md:bg-neutral">
                <h3 className="lg:pl-3 text-3xl md:text-2xl md:text-white ibmplex text-center">Change Password
                </h3>
            </div>
            <div className={"border"}>
                <div>
                    <p className="text-gray-500 text-xs font-semibold pl-3 pt-1 text-center md:text-start">New password must be at least 6 characters
                    </p>
                </div>
                <div className={"px-12 pb-12 pt-4"}>
                    <form onSubmit={submitPasswordHandler} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 tracking-wide">
                                New password
                            </label>
                            <input
                                className="bg-white w-full text-base px-4 py-2 border  border-gray-300 focus:outline-none focus:border-blue-400"
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
                                className="bg-white w-full content-center text-base px-4 py-2 border  border-gray-300 focus:outline-none focus:border-blue-400"
                                autoComplete={"password"}
                                type={"password"}
                                placeholder={"Confirm password"}
                                id={"confirm-password"}
                                onChange={(e) => {setConfirmPassword(e.target.value)}}
                                value={confirmPassword}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 tracking-wide">Current password
                            </label>
                            <input
                                className="bg-white w-full text-base px-4 py-2 border  border-gray-300 focus:outline-none focus:border-blue-400"
                                autoComplete={"password"}
                                placeholder={"Current password"}
                                type={"password"}
                                id={"current-password"}
                                value={currentPassword}
                                onChange={(e) => {setCurrentPassword(e.target.value)}}
                                required
                            />
                        </div>
                        {/*<div className={"flex justify-center items-center h-5 text-lg"}>*/}
                        {/*    {*/}
                        {/*        errorMessage2 && (*/}
                        {/*            <span className={"text-red-500 font-bold"}>*/}
                        {/*                {errorMessage2}*/}
                        {/*            </span>*/}
                        {/*        )*/}
                        {/*    }*/}
                        {/*    {*/}
                        {/*        successMessage2 && (*/}
                        {/*            <span className={"text-green-500 font-bold"}>*/}
                        {/*                {successMessage2}*/}
                        {/*            </span>*/}
                        {/*    */}
                        {/*        )*/}
                        {/*    }*/}
                        {/*</div>*/}
                        <div className={"pt-8 flex justify-center"}>
                            <button disabled={newPassword.length < 6 || confirmPassword.length < 6} type="submit" className={`${(newPassword.length >= 6 && confirmPassword.length >= 6) && "shadow-blue"} btn-primary btn btn-wide`}>
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileAccountPassword;