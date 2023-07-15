import React from 'react';
import {useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation} from "../slices/usersApiSlice";
import {useState} from "react";
import Spinner from "../components/Spinner";
import {FaCheck, FaCheckCircle, FaEdit, FaImages, FaMinusCircle, FaPlus, FaTimes, FaTrash} from "react-icons/fa";
import {useEffect} from "react";
import {setLoading} from "../slices/loadingSlice";
import {useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";
import AdminTabs from "../components/AdminTabs";


const AdminUserListPage = () => {


    const {data: users, isLoading, error} = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const [localData, setLocalData] = useState(users ? users : null);
    const [editMode, setEditMode] = useState(false);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [modalMessage, setModalMessage] = useState("");

    const dispatch = useDispatch()
    const confirmUpdateHandler = () => {
        let updated = confirmChanges();
        if (updated) {
            setModalMessage(convertToString(updated));
            window.confirm_modal.showModal();
        } else {
            completeEditHandler();
        }
    };

    const submitDeleteProduct = async () => {
        const confirm = window.confirm("Are you sure you want to delete this user? This cannot be undone");
        if (confirm) {
            dispatch(setLoading(true));
            await deleteUser(userId);
            setLocalData(prevState => {
                return prevState.filter(function (user) {
                    return user._id !== userId;
                });
            });
        }
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
            const res = await updateUser(updatedProduct);
            if (res) {
                setLocalData(prevState => {
                    return prevState.map(function (obj) {
                        if (obj._id === res.data._id) {
                            return res.data;
                        } else {
                            return obj;
                        }
                    });
                });
            }
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
        setIsAdmin(obj.isAdmin);
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
            isAdmin: updatedObj.isAdmin,
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

    const closeEditModal = (e) => {
        e.preventDefault();
        window.confirm_modal.close();
    };

    useEffect(function () {
        if (users) {
            if (!localData) {
                setLocalData(users);
            }
        }
    }, [users, localData]);

    return (
        isLoading || !localData ? <Spinner/> : error ? error : (
            <div className={"pt-10"}>
              <AdminTabs/>
                <div className={"mt-5 card border-2 border-neutral/90 bg-base-100 shadow-xl"}>
                    <div className={"w-full px-5 flex justify-center pt-5"}>
                        <div className={" text-2xl text-center font-bold"}>
                            User List
                        </div>

                    </div>
                    <div className="overflow-x-auto p-5">
                        <table className="table table-zebra w-fit xl:w-full table-sm">
                            <thead>
                            <tr>
                                <th/>
                                <th>ID</th>
                                <th className={"p-1"}>Name</th>
                                <th className={"p-1"}>Email</th>
                                <th className={"p-1"}>Admin</th>
                                <th className={"p-1"}>Address</th>
                                <th className={"p-1"}>Joined</th>
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
                                                            <td className={"bg-blue-200"}>{user._id.substring(user._id.length - 6, user._id.length)}</td>
                                                            {/*<td><input type={"text"} value={item.name}/></td>*/}
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <input
                                                                    className="pl-1 py-2 shadow appearance-none border rounded w-24 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border w-full rounded py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    type={"text"}
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-16 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    type={"text"}
                                                                    value={isAdmin}
                                                                    onChange={(e) => setIsAdmin(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 bg-blue-200"}>{user.shippingAddresses.length !== 0 ? user.shippingAddresses.map(function (obj, index) {
                                                                return (
                                                                    `${obj.address}, ${obj.city}, ${obj.postalCode} ${user.shippingAddresses.length > 1 ? "," : ""}`
                                                                )
                                                            }) : (
                                                                "No saved address"
                                                            )}</td>
                                                            <td className={"p-1 w-24 bg-blue-200"}>{user?.createdAt.substring(0, 10)}</td>
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <div className={"flex"}>
                                                                    <button onClick={confirmUpdateHandler} className={"text-green-500 btn-glass btn-sm p-2 rounded-full"}>
                                                                        <FaCheckCircle/>
                                                                    </button>
                                                                    <button onClick={submitDeleteProduct} className={"text-red-500 btn-glass btn-sm p-2 rounded-full"}>
                                                                        <FaMinusCircle/>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th>{index+1}</th>
                                                            <td>{user._id.substring(user._id.length - 6, user._id.length)}</td>
                                                            <td className={"p-1"}>{user.name}</td>
                                                            <td className={"p-1"}>{user.email}</td>
                                                            <td className={"p-1"}>{user.isAdmin ? <FaCheck fill={"green"}/> : <FaTimes fill={"red"}/>}</td>
                                                            <td className={"p-1"}>{user.shippingAddresses.length !== 0 ? user.shippingAddresses.map(function (obj, index) {
                                                                return (
                                                                    `${obj.address}, ${obj.city}, ${obj.postalCode} ${user.shippingAddresses.length > 1 ? "," : ""}`
                                                                )
                                                            }) : (
                                                                "No saved address"
                                                            )}</td>
                                                            <td className={"w-24 p-1"}>{user?.createdAt.substring(0, 10)}</td>
                                                            <td className={"p-1"}>
                                                                <div className={"flex"}>
                                                                    <button onClick={() => editUserHandler(user._id)} className={"btn-glass p-2 btn-sm rounded-full hover:text-primary"}>
                                                                        <FaEdit/>
                                                                    </button>
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
                <dialog id="confirm_modal" className="modal modal-bottom sm:modal-middle">
                    <form method="dialog" className="modal-box">
                        <h3 className="p-4 font-bold text-lg">Please confirm these are the changes you wish to make.</h3>
                        <div className="px-4">
                            {
                                modalMessage !== "" && (
                                    modalMessage.split("&").map(function(sentence, index){
                                        //     let c = sentence.indexOf(":");
                                        // .substring(c+1, sentence.length)
                                        return (
                                            <p className={"py-2"} key={index}>{sentence}</p>
                                        )
                                    })
                                )
                            }
                        </div>
                        <div className="modal-action">
                            <button onClick={closeEditModal} className={"btn btn-error"}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={submitUpdateHandler}
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </dialog>

            </div>
        )
    );
};

export default AdminUserListPage;