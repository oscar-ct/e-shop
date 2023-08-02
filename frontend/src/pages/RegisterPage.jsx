import React from 'react';
import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useRegisterMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {setLoading} from "../slices/loadingSlice";
import axios from "axios";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [invalidRegister, setInvalidRegister] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { email, password, name, confirmPassword } = formData;
    const [register
        // { isLoading }
    ] = useRegisterMutation();

    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const redirect = searchParams.get("redirect") || "/";

    const { userData } = useSelector(function (state) {
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

    const submitRegister = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        if (password !== confirmPassword) {
            setInvalidRegister(true);
            setErrorMessage("Passwords do not match!");
        } else {
            try {
                const payload = await register({ name: name, email: email, password: password }).unwrap();
                if (payload) {
                    const { data } = await axios.get(`/api/users/profile`);
                    dispatch(setCredentials({...data}));
                    navigate(redirect);
                    dispatch(setLoading(false));
                }
            } catch (e) {
                dispatch(setLoading(false));
                setInvalidRegister(true);
                setErrorMessage(e.error || e.data?.message);
                setFormData(prevState => {
                    return {
                        ...prevState,
                        password: "",
                        confirmPassword: "",
                    }
                });
            }
        }
    }


    return (
        <>
            <div className="h-max relative">
                <div className="mt-5 h-full flex flex-row justify-center">
                    <div className="w-full flex justify-center self-center">
                        <div className="bg-base-100 shadow-xl p-12 mx-auto rounded-2xl sm:w-96 w-full">
                            <div className="mb-4">
                                <h3 className="font-semibold text-2xl text-gray-800">Register
                                </h3>
                                <p className="text-xs text-gray-500">Please fill out all text fields to register an account.
                                </p>
                            </div>
                            <form onSubmit={submitRegister} className="space-y-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">Full Name
                                    </label>
                                    <input
                                        className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"name"}
                                        type={"name"}
                                        placeholder={"John Doe"}
                                        id={"name"}
                                        value={name}
                                        onChange={onCredentialChange}
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
                                        placeholder={"mail@hotmail.com"}
                                        id={"email"}
                                        value={email}
                                        onChange={onCredentialChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                                        Password
                                    </label>

                                    <input
                                        className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"password"}
                                        type={ showPassword ? "text" : "password"}
                                        placeholder={"Enter your password"}
                                        id={"password"}
                                        value={password}
                                        onChange={onCredentialChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">
                                        Confirm Password
                                    </label>

                                    <input
                                        className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
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

                                {
                                    invalidRegister && (
                                        <div className={"flex justify-center"}>
                                            <span className={"text-red-500 font-bold"}>{errorMessage}</span>
                                        </div>
                                    )
                                }

                                <div className={"flex justify-center"}>
                                    <button type="submit" className="btn btn-wide">
                                       Register
                                    </button>
                                </div>
                            </form>
                            <div className={"flex justify-center"}>
                                <p className={"pt-6"}>
                                    Already have an account?
                                </p>
                                <Link to={ redirect ? `/login?redirect=${redirect}` : "/login"} className="link text-blue-400 hover:text-blue-500 pt-6 pl-1">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;