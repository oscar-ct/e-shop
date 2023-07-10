import React from 'react';
import {useEffect, useState} from "react";
import {useUpdateUserCredentialsMutation, useVerifyPasswordMutation} from "../slices/usersApiSlice";
import {useDispatch} from "react-redux";
import {setLoading} from "../slices/loadingSlice";


const ProfileAccountPassword = () => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage2, setErrorMessage2] = useState(null);
    const [successMessage2, setSuccessMessage2] = useState(null);

    const [updateUserCredentials] = useUpdateUserCredentialsMutation();
    const [verifyPassword] = useVerifyPasswordMutation();

    const dispatch = useDispatch();

    const clearPasswordFields = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    useEffect(function() {
        if (errorMessage2 || successMessage2) {
            setTimeout(function () {
                setErrorMessage2(null);
                setSuccessMessage2(null);
            }, 3000)
        }

    }, [errorMessage2, successMessage2]);

    const submitPasswordHandler = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage2("New passwords do not match!");
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
                            setSuccessMessage2("Password updated!");
                            dispatch(setLoading(false));
                        } else {
                            setErrorMessage2("Something went wrong, try again later");
                            dispatch(setLoading(false));
                        }

                    } catch (e) {
                        setErrorMessage2(e);
                        dispatch(setLoading(false));
                    }
                } else {
                    setErrorMessage2("Invalid password")
                    dispatch(setLoading(false));
                }
            } catch (e) {
                setErrorMessage2(e);
                dispatch(setLoading(false))
            }
        }
        clearPasswordFields();
    }


    return (
        <div className="mt-10 lg:mt-0 bg-base-100 shadow-xl p-12 mx-auto rounded-2xl sm:w-96 w-full">
            <div className="mb-4">
                <h3 className="font-semibold text-2xl text-gray-800">Change Password
                </h3>
                <p className="text-gray-500 font-bold text-xs">New password must be at least 6 characters
                </p>
            </div>
            <form onSubmit={submitPasswordHandler} className="space-y-5">
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
                <div className={"flex justify-center items-center h-5 text-lg"}>
                    {
                        errorMessage2 && (
                            <span className={"text-red-500 font-bold"}>
                                {errorMessage2}
                            </span>
                        )
                    }
                    {
                        successMessage2 && (
                            <span className={"text-green-500 font-bold"}>
                                {successMessage2}
                            </span>

                        )
                    }
                </div>
                <div className={"flex justify-center"}>
                    <button disabled={newPassword.length < 6 || confirmPassword.length < 6} type="submit" className="btn btn-wide btn-primary">
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileAccountPassword;