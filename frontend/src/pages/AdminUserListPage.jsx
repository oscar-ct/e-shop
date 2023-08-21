import React from 'react';
import {useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation} from "../slices/usersApiSlice";
import {useState} from "react";
import Spinner from "../components/Spinner";
import {FaCheck, FaCheckCircle, FaEdit, FaMinusCircle, FaTimes} from "react-icons/fa";
import {useEffect} from "react";
import {setLoading} from "../slices/loadingSlice";
import {useDispatch, useSelector} from "react-redux";
import AdminTabs from "../components/AdminTabs";
import {setCredentials} from "../slices/authSlice";
import AlertModal from "../components/AlertModal";
import ConfirmModal from "../components/ConfirmModal";
import Meta from "../components/Meta";


const AdminUserListPage = () => {


    const {data: users, isLoading, refetch, error} = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const {userData} = useSelector(function (state) {
        return state.auth;
    });

    const [localData, setLocalData] = useState(users ? users : null);
    const [editMode, setEditMode] = useState(false);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [modalMessage, setModalMessage] = useState("");

    const dispatch = useDispatch();

    const confirmUpdateModal = () => {
        let updated = confirmChanges();
        if (updated) {
            setModalMessage(convertToString(updated));
            window.confirm_modal.showModal();
        } else {
            completeEditHandler();
        }
    };

    const submitDeleteUser = async () => {
        dispatch(setLoading(true));
        await deleteUser(userId);
        setLocalData(prevState => {
            return prevState.filter(function (user) {
                return user._id !== userId;
            });
        });
        completeEditHandler();
        dispatch(setLoading(false));
    }

    const submitUpdateHandler = async (e) => {
        e.preventDefault();
        window.confirm_modal.close();
        dispatch(setLoading(true));
        const updatedProduct = {
            _id: userId,
            name,
            email,
            isAdmin,
        }


        try {
            const res = await updateUser(updatedProduct).unwrap();
            refetch();
            if (res._id === userData._id) {
                const data = {
                    email: res.email,
                    isAdmin: res.isAdmin,
                    name: res.name,
                    shippingAddresses: res.shippingAddresses,
                    _id: res._id,
                }
                dispatch(setCredentials(data));
            }
            setLocalData(prevState => {
                return prevState.map(function (obj) {
                    if (obj._id === res._id) {
                        return res;
                    } else {
                        return obj;
                    }
                });
            });
        } catch (e) {
            console.log(e);
        }
        completeEditHandler();
        dispatch(setLoading(false));
    };

    const editUserHandler = (id) => {
        const obj = localData.find((x) => x._id === id);
        setEditMode(true);
        setUserId(id);
        setName(obj.name);
        setEmail(obj.email);
        setIsAdmin(obj.isAdmin.toString());
    };

    const completeEditHandler = () => {
        setEditMode(false);
        setUserId(null);
        setName(null);
        setEmail(null);
        setIsAdmin(null);
        setModalMessage("");
    };

    const confirmChanges = () => {
        const updatedObj = localData.find(function (obj) {
            return obj._id === userId;
        });
        const b = {
            name,
            email,
            isAdmin,
        }
        const a = {
            name: updatedObj.name,
            email: updatedObj.email,
            isAdmin: updatedObj.isAdmin.toString(),
        }
        return Object.entries(b).filter(([key, val]) => a[key] !== val && key in a).reduce((a, [key, v]) => ({
            ...a,
            [key]: v
        }), null);
    };
    const convertToString = () => {
        let message = "";
        const updates = confirmChanges();
        if (updates) {
            for (const key in updates) {
                message += `${key}: ${updates[key]}&`;
            }
        }
        return message;
    };

    useEffect(function () {
        if (users) {
            if (!localData) {
                setLocalData(users);
            }
        }
    }, [users, localData]);

    const openConfirmDeleteUserModal = () => {
        window.alert_modal.showModal();
    };

    return (
        isLoading || !localData ? <Spinner/> : error ? error : (
            <>
                <Meta title={"User List"}/>
                <div className={"py-10"}>
                    <AdminTabs/>
                    <div className={"mt-5 card bg-white shadow-xl"}>
                        <div className={"w-full px-5 flex justify-center pt-5"}>
                            <div className={" text-2xl text-center"}>
                                Users ({localData.length})
                            </div>

                        </div>
                        <div className="overflow-x-auto px-5 py-10">
                            <table className="table w-full table-zebra table-sm">
                                <thead>
                                <tr>
                                    <th/>
                                    {/*<th>ID</th>*/}
                                    <th className={"p-1"}>Name</th>
                                    <th className={"p-1"}>Email</th>
                                    <th className={"p-1"}>Admin</th>
                                    <th className={"p-1"}>Address</th>
                                    <th className={"p-1"}>Joined</th>
                                    <th/>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    localData && (
                                        localData.map(function(user, index) {
                                            return (
                                                <tr className={"hover"} key={index}>

                                                    {
                                                        editMode && user._id === userId ? (
                                                            <>
                                                                <th className={"bg-blue-200"}>{index+1}</th>
                                                                {/*<td className={"bg-blue-200"}>{user._id.substring(user._id.length - 6, user._id.length)}</td>*/}
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <input
                                                                        className="bg-white pl-1 py-2 shadow w-full appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        value={name}
                                                                        onChange={(e) => setName(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <input
                                                                        className="bg-white pl-1 w-full shadow appearance-none border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        type={"text"}
                                                                        value={email}
                                                                        onChange={(e) => setEmail(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <select
                                                                        className="bg-white pl-1 w-16 shadow border rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        value={isAdmin}
                                                                        onChange={(e) => setIsAdmin(e.target.value)}
                                                                    >
                                                                        <option value={"true"}>
                                                                            true
                                                                        </option>
                                                                        <option value={"false"}>
                                                                            false
                                                                        </option>
                                                                    </select>
                                                                </td>
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <details className={"flex flex-wrap"}>
                                                                        <summary className={"hover:link-primary truncate cursor-pointer "}>
                                                                            Address List
                                                                        </summary>
                                                                        {user.shippingAddresses.length !== 0 ? user.shippingAddresses.map(function (obj, index) {
                                                                            return (
                                                                                <span key={index} className={`${index % 2 === 0 ? "font-bold" : "text-zinc-600"} truncate pt-2 pl-2 text-xs`}>
                                                                                {obj.address}, {obj.city}, {obj.postalCode}
                                                                            </span>
                                                                            )
                                                                        }) : (
                                                                            <span className={"pl-2 text-xs"}>
                                                                                No saved address
                                                                            </span>
                                                                        )}
                                                                    </details>
                                                                </td>
                                                                <td className={"p-1 truncate bg-blue-200"}>{user?.createdAt.substring(0, 10)}</td>
                                                                <td className={"p-1 bg-blue-200 w-20"}>
                                                                    <div className={"flex items-center"}>
                                                                        <div className="tooltip tooltip-bottom" data-tip="save changes">
                                                                            <button onClick={confirmUpdateModal} className={"text-green-500 btn-glass btn-xs rounded-full"}>
                                                                                <FaCheckCircle className={"text-sm"}/>
                                                                            </button>
                                                                        </div>
                                                                        <div className="tooltip tooltip-bottom" data-tip="delete user">
                                                                            <button onClick={openConfirmDeleteUserModal} className={"text-red-500 btn-glass btn-xs rounded-full"}>
                                                                                <FaMinusCircle className={"text-sm"}/>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <th>{index+1}</th>
                                                                {/*<td>{user._id.substring(user._id.length - 6, user._id.length)}</td>*/}
                                                                <td className={"p-1 truncate"}>{user.name}</td>
                                                                <td className={"p-1"}>{user.email}</td>
                                                                <td className={"p-1"}>{user.isAdmin ? <FaCheck className={"text-green-500"}/> : <FaTimes fill={"red"}/>}</td>
                                                                <td className={"p-1 "}>
                                                                    <details className={"flex flex-wrap"}>
                                                                        <summary className={"hover:link-primary truncate cursor-pointer "}>
                                                                            Address List
                                                                            </summary>
                                                                        {user.shippingAddresses.length !== 0 ? user.shippingAddresses.map(function (obj, index) {
                                                                        return (
                                                                            <span key={index} className={`${index % 2 === 0 ? "font-bold" : "text-zinc-600"} truncate pl-2 pt-2 text-xs`}>
                                                                                {obj.address}, {obj.city}, {obj.postalCode}
                                                                            </span>
                                                                            )
                                                                        }) : (
                                                                            <span className={"pl-2 text-xs"}>
                                                                                No saved address
                                                                            </span>
                                                                        )}
                                                                    </details>
                                                                </td>
                                                                <td className={"p-1 truncate"}>{user?.createdAt.substring(0, 10)}</td>
                                                                <td className={"p-1 w-20"}>
                                                                    <div className={"flex "}>
                                                                        <button onClick={() => editUserHandler(user._id)} className={"btn-glass btn-xs rounded-full hover:text-primary"}>
                                                                            <FaEdit className={"text-sm"}/>
                                                                        </button>
                                                                        <span className={"px-4"}/>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )
                                                    }
                                                </tr>

                                            )
                                        })
                                    )

                                }
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/*MODALS BELOW*/}

                    <ConfirmModal title={"Confirm Changes"} initiateFunction={submitUpdateHandler}>
                        <h3 className="font-semibold text-lg">Please confirm these are the changes you wish to make --</h3>
                        {
                            modalMessage !== "" && (
                                modalMessage.split("&").map(function(sentence, index){
                                    return (
                                        <p className={"pt-3"} key={index}>{sentence}</p>
                                    )
                                })
                            )
                        }
                    </ConfirmModal>

                    <AlertModal title={"Delete User"} initiateFunction={() => submitDeleteUser()}>
                        <div className={"flex flex-col"}>
                            <p>
                                Are you sure you want to delete this user?
                                <span className={"pl-2 text-red-600 font-semibold"}>
                                    This cannot be undone.
                                </span>
                            </p>
                            <p className={"pt-3 text-center font-bold text-lg"}>
                                {`${name}, ${email}`}
                            </p>
                        </div>
                    </AlertModal>

                </div>
            </>
        )
    );
};

export default AdminUserListPage;