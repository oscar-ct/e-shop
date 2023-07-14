import React, {useEffect, useState} from 'react';
import Spinner from "../components/Spinner";
import {FaCheckCircle, FaEdit, FaImages, FaMinusCircle, FaTimes, FaPlus, FaTrash} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {
    useGetProductsQuery,
    useUpdateProductImagesMutation,
    useUpdateProductMutation
} from "../slices/productsApiSlice";
import {useDispatch} from "react-redux";
import {setLoading} from "../slices/loadingSlice";



const AdminProductListPage = () => {

    const {data: products, isLoading, error} = useGetProductsQuery();
    const [updateProduct, {error: errorUpdate}] = useUpdateProductMutation();
    const [updateProductImages, {error: errorUpdateImages}] = useUpdateProductImagesMutation();

    const [localData, setLocalData] = useState(products ? products : null);
    const [editMode, setEditMode] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [productId, setProductId] = useState(null);
    const [name, setName] = useState(null);
    const [model, setModel] = useState(null);
    const [brand, setBrand] = useState(null);
    const [price, setPrice] = useState(null);
    const [inStock, setInStock] = useState(null);
    const [category, setCategory] = useState(null);
    const [description, setDescription] = useState(null);
    const [modalMessage, setModalMessage] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const openImagesHandler = (id) => {
        setModalIsOpen(true);
        setProductId(id);
        window.images_modal.showModal();
    };
    const closeImagesModal = () => {
        setModalIsOpen(false);
        setProductId(null);
        window.images_modal.close();
    };

    const submitUpdateHandler = async (e) => {
        e.preventDefault();
        window.confirm_modal.close();
        dispatch(setLoading(true));
        const updatedProduct = {
            productId,
            name,
            brand,
            model,
            price,
            countInStock: inStock,
            category,
            description,
        }
        try {
            const res = await updateProduct(updatedProduct);
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
    const completeEditHandler = () => {
        setEditMode(false);
        setProductId(null);
        setName(null);
        setModel(null);
        setBrand(null);
        setPrice(null);
        setInStock(null);
        setCategory(null);
        setDescription(null);
        setModalMessage("");
    };
    const editProductHandler = (id) => {
        const obj = localData.find((x) => x._id === id);
        setEditMode(true);
        setProductId(id);
        setName(obj.name);
        setModel(obj.model);
        setBrand(obj.brand);
        setPrice(obj.price);
        setInStock(obj.countInStock);
        setCategory(obj.category);
        setDescription(obj.description);
    };
    const confirmUpdateHandler = () => {
        let updated = confirmChanges();
        if (updated) {
            setModalMessage(convertToString(updated));
            window.confirm_modal.showModal();
        } else {
            completeEditHandler();
        }
    };
    const confirmChanges = () => {
        const updatedObj = localData.find(function (obj) {
            return obj._id === productId;
        });
        const b = {
            name,
            brand,
            model,
            price,
            countInStock: inStock,
            category,
            description,
        }
        const a = {
            name: updatedObj.name,
            brand: updatedObj.brand,
            model: updatedObj.model,
            price: updatedObj.price,
            countInStock: updatedObj.countInStock,
            category: updatedObj.category,
            description: updatedObj.description,
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
        if (products) {
            if (!localData) {
                setLocalData(products);
            }
        }
    }, [products, localData]);

    return (
        isLoading || !localData ? <Spinner/> : error ? error : (
            <div className={"pt-10"}>
                <div className={"card bg-base-100 shadow-xl"}>
                    <div className={"w-full px-5 flex justify-center pt-5"}>
                        <div className={" text-2xl text-center font-bold"}>
                            Product List
                            <button
                                onClick={() => navigate("/admin/products/create")}
                                className={"absolute right-6 self-end btn btn-sm"}
                            >
                                <FaPlus/>
                                New Product
                            </button>
                        </div>

                    </div>
                    <div className="overflow-x-auto p-5">
                        <table className="table table-zebra w-fit xl:w-full table-sm">
                            <thead>
                            <tr>
                                <th/>
                                <th>ID</th>
                                <th className={"p-1"}>Name</th>
                                <th className={"p-1"}>Brand</th>
                                <th className={"p-1"}>Model</th>
                                <th className={"p-1"}>Price</th>
                                <th className={"p-1"}>Stock</th>
                                <th className={"p-1"}>Category</th>
                                <th className={"p-1"}>Description</th>
                                <th className={"p-1"}>List date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                localData && (
                                    localData.map(function(item, index) {
                                        return (
                                            <tr className={"hover"} key={index}>

                                                {
                                                    editMode && item._id === productId ? (
                                                        <>
                                                            <th>{index+1}</th>
                                                            <td>{item._id.substring(item._id.length - 6, item._id.length)}</td>
                                                        {/*<td><input type={"text"} value={item.name}/></td>*/}
                                                            <td className={"p-1"}>
                                                                <input
                                                                    className="pl-1 py-2 shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-16 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    type={"text"}
                                                                    value={brand}
                                                                    onChange={(e) => setBrand(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-24 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    type={"text"}
                                                                    value={model}
                                                                    onChange={(e) => setModel(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-20 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    type={"number"}
                                                                    min={0}
                                                                    value={price}
                                                                    onChange={(e) => setPrice(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-10 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    type={"number"}
                                                                    min={0}
                                                                    value={inStock}
                                                                    onChange={(e) => setInStock(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-20 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    type={"text"}
                                                                    value={category}
                                                                    onChange={(e) => setCategory(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 pt-2"}>
                                                                <textarea
                                                                    className="pl-1 shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    value={description}
                                                                    onChange={(e) => setDescription(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 w-24"}>{item?.createdAt.substring(0, 10)}</td>
                                                            <td className={"p-1"}>
                                                                <div className={"flex"}>
                                                                    <button onClick={confirmUpdateHandler} className={"text-green-500 btn-glass btn-sm p-2 rounded-full"}>
                                                                        <FaCheckCircle/>
                                                                    </button>
                                                                    <button onClick={completeEditHandler} className={"text-red-500 btn-glass btn-sm p-2 rounded-full"}>
                                                                        <FaMinusCircle/>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                        <th>{index+1}</th>
                                                        <td>
                                                            <Link className={"link link-primary"} to={`/product/${item._id}`}>
                                                                {item._id.substring(item._id.length - 6, item._id.length)}
                                                            </Link>
                                                        </td>
                                                        <td className={"p-1"}>{item.name}</td>
                                                        <td className={"p-1"}>{item.brand}</td>
                                                        <td className={"p-1"}>{item.model}</td>
                                                        <td className={"p-1"}>${item.price}</td>
                                                        <td className={"p-1"}>{item.countInStock !== 0 ? item.countInStock : <FaTimes fill={"red"}/>}</td>
                                                        <td className={"p-1"}>{item.category}</td>
                                                        <td className={"p-1"}>{item.description.substring(0, 32)}...</td>
                                                        <td className={"w-24 p-1"}>{item?.createdAt.substring(0, 10)}</td>
                                                        <td className={"p-1"}>
                                                            <div className={"flex"}>
                                                                <button onClick={() => editProductHandler(item._id)} className={"btn-glass p-2 btn-sm rounded-full hover:text-primary"}>
                                                                <FaEdit/>
                                                                </button>
                                                                <button onClick={() => openImagesHandler(item._id)} className={"btn-glass p-2 btn-sm rounded-full hover:text-primary"}>
                                                                    <FaImages/>
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
                        <h3 className="p-4 font-bold text-lg">Please confirm the changes you wish to make.</h3>
                        <div className="px-4">
                            {
                                modalMessage !== "" && (
                                    modalMessage.split("&").map(function(sentence, index){
                                        let c = sentence.indexOf(":");
                                        return (
                                            <p className={"py-2"} key={index}>{sentence.substring(c+1, sentence.length)}</p>
                                        )
                                    })
                                )
                            }
                        </div>
                        <div className="modal-action">
                            <button className={"btn btn-error"}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={submitUpdateHandler}
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </dialog>

                <dialog id="images_modal" className="modal modal-bottom sm:modal-middle">
                    {
                        modalIsOpen && (
                            <form method="dialog" className="modal-box">
                                <div className="px-4 pt-2">
                                    <h2 className={"pb-5 text-center text-xl"}>{localData.find((x) => x._id === productId).name}</h2>
                                    {
                                        localData.find((x) => x._id === productId).images.length !== 0 ? (
                                            localData.find((x) => x._id === productId).images.map(function (image) {
                                                return (
                                                    <div key={image.handle}>
                                                        <div className={"flex flex-col items-center"}>
                                                            <div className={"flex max-w-full"}>
                                                                <img className={"rounded-xl w-56"} src={image.url} alt={"product"}/>
                                                                <div className={"flex items-center pl-5"}>
                                                                    <button type={"button"}  className={"btn-sm rounded-full btn-error text-white"}>
                                                                        <FaTrash/>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <h2 className={"font-bold text-2xl"}>No images found</h2>
                                        )
                                    }
                                </div>
                                <div className="modal-action">
                                    {/*<button onClick={openPicker} className={"btn rounded-xl"}>Add Image</button>*/}
                                    <button className={"btn btn-neutral rounded-xl"} onClick={closeImagesModal}>Close</button>
                                </div>
                            </form>
                        )
                    }

                </dialog>
            </div>
        )
    );
};

export default AdminProductListPage;