import React from 'react';
import {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {useSelector, useDispatch} from "react-redux";
import {useLoginMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import {setLoading} from "../slices/loadingSlice";
import axios from "axios";
import {toast} from "react-hot-toast";
import Meta from "../components/Meta";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    // const [invalidLogin, setInvalidLogin] = useState(false);
    // const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { email, password } = formData;
    const [login] = useLoginMutation();
    // const {data, isLoading: userDataLoading} = useGetUserDataQuery();


    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const redirect = searchParams.get("redirect") || "/";

    const {userData} = useSelector(function (state) {
        return state.auth;
    });


    useEffect(function () {
        if (userData) {
            navigate(redirect);
        }
    }, [userData, navigate, redirect]);

    const onCredentialChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const submitSignIn = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const payload = await login({ email: email, password: password }).unwrap();
            // console.log("fulfilled", payload);
            if (payload) {
                const { data } = await axios.get(`/api/users/profile`);
                dispatch(setCredentials({...data}));
                navigate(redirect);

            }
        } catch (e) {
            // setInvalidLogin(true);
            // setErrorMessage(e.error || e.data?.message);
            toast.error(e.error || e.data?.message);
            setFormData(prevState => {
                return {
                    ...prevState,
                    password: "",
                }
            })
            // console.log(e.error || e.data?.message);
        }
        dispatch(setLoading(false));
    }


    return (
        <>
            <Meta title={"Login"}/>
            <div className="h-max relative">
                <div className="h-full flex flex-row justify-center">
                    <div className="sm:mt-10 mb-10 w-full flex justify-center self-center">
                        <div className="bg-white shadow-xl p-12 mx-auto rounded-2xl sm:w-96 w-full">
                            <div className="mb-4">
                                <h3 className="font-semibold text-2xl">Login
                                </h3>
                                <p className="text-gray-500">Please sign in to your account.
                                </p>
                            </div>
                            <form onSubmit={submitSignIn} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600 tracking-wide">Email
                                    </label>
                                    <input
                                        className="bg-white w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"email"}
                                        type={"email"}
                                        placeholder={"mail@hotmail.com"}
                                        id={"email"}
                                        value={email}
                                        onChange={onCredentialChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="mb-5 text-sm font-medium text-gray-600 tracking-wide">
                                        Password
                                    </label>

                                    <input
                                        className="bg-white w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"current-password"}
                                        type={ showPassword ? "text" : "password"}
                                        placeholder={"Enter your password"}
                                        id={"password"}
                                        value={password}
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

                                        <div className="flex justify-end">
                                            <div className="text-sm">
                                                <Link to={"/forgot-password"} className="text-blue-400 hover:text-blue-500">
                                                    Forgot your password?
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*{*/}
                                {/*    invalidLogin && (*/}
                                {/*        <div className={"flex justify-center"}>*/}
                                {/*           <span className={"text-red-500 font-bold"}>{errorMessage}</span>*/}
                                {/*        </div>*/}
                                {/*    )*/}
                                {/*}*/}

                                <div className={"flex justify-center"}>
                                    <button type="submit" className="rounded-xl btn btn-wide">
                                        Sign in
                                    </button>
                                </div>
                            </form>
                            <div className={"flex justify-center"}>
                                <p className={"pt-6"}>
                                    Don't have an account?
                                </p>
                                <Link to={ redirect ? `/register?redirect=${redirect}` : "/register"} className="link text-blue-400 hover:text-blue-500 pt-6 pl-1">
                                    Register Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;