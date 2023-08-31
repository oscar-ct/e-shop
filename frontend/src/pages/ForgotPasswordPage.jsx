import {useGetResetPasswordQuery, useResetPasswordMutation} from "../slices/usersApiSlice";
import {useNavigate, useParams} from "react-router-dom";
import Meta from "../components/Meta";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";

const ForgotPasswordPage = () => {
    const params = useParams();
    const { data, isLoading, error } = useGetResetPasswordQuery(params);
    const [resetPassword] = useResetPasswordMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const {password, confirmPassword } = formData;

    const onCredentialChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };
    const navigate = useNavigate();

    const submitResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
        } else {
            const res = await resetPassword({id: data._id, newPassword: password});
            if (res) {
                setFormData({
                    password: "",
                    confirmPassword: "",
                });
                if (res.error) {
                    toast.error(res.error.data.message);
                } else {
                    toast.success(res.data.message);
                }
                setTimeout(function () {
                    navigate("/login");
                }, 1800);
            }
        }
    }

    useEffect(function () {
        if (error) {
            navigate("/notfound")
        }
    }, [error, navigate])


    return (
        <>
            <Meta title={"Reset Password"}/>
            {
                !isLoading && (
                    <div className="h-max relative">
                        <div className="h-full flex flex-row justify-center">
                            <div className="sm:mt-10 mb-10 w-full flex justify-center self-center">
                                <div className="bg-white shadow-xl p-12 mx-auto rounded-2xl sm:w-96 w-full">
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-2xl">Reset Password
                                        </h3>
                                        <p className="text-xs text-gray-500">Password must be at least 6 characters
                                        </p>
                                    </div>
                                    <form onSubmit={submitResetPassword} className="space-y-3">
                                        <div className="space-y-2">
                                            <label className="mb-5 text-sm font-medium text-gray-600 tracking-wide">
                                                New Password
                                            </label>

                                            <input
                                                className="bg-white w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                autoComplete={"password"}
                                                type={ showPassword ? "text" : "password"}
                                                placeholder={"Enter your new password"}
                                                id={"password"}
                                                value={password}
                                                onChange={onCredentialChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600 tracking-wide">
                                                Confirm Password
                                            </label>

                                            <input
                                                className="bg-white w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                autoComplete={"confirm-password"}
                                                type={ showPassword ? "text" : "password"}
                                                placeholder={"Confirm your password"}
                                                id={"confirmPassword"}
                                                value={confirmPassword}
                                                onChange={onCredentialChange}
                                                required
                                            />
                                            <div className={"flex justify-start flex-row-reverse"}>
                                                {
                                                    showPassword ? (
                                                        <FaEye
                                                            onClick={() => setShowPassword(prevState => !prevState)}
                                                            className={"show-password-img"}
                                                        />
                                                    ) : (
                                                        <FaEyeSlash
                                                            onClick={() => setShowPassword(prevState => !prevState)}
                                                            className={"show-password-img"}
                                                        />
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className={"flex justify-center"}>
                                            <button disabled={formData.password.trim().length < 6 || formData.confirmPassword.trim().length < 6} type="submit" className="btn rounded-xl btn-wide">
                                                Reset
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default ForgotPasswordPage;