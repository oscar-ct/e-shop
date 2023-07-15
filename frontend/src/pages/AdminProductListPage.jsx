import React, {useEffect, useState} from 'react';
import Spinner from "../components/Spinner";
import {FaCheckCircle, FaEdit, FaImages, FaMinusCircle, FaTimes, FaPlus, FaTrash} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {
    useGetProductsQuery,
    useUpdateProductImagesMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useDeleteProductImageMutation,
} from "../slices/productsApiSlice";
import {useDispatch} from "react-redux";
import {setLoading} from "../slices/loadingSlice";
import {useGetFilestackTokenQuery, useDeleteImageFromFilestackMutation, useEncodeHandleMutation} from "../slices/filestackSlice";
import * as filestack from "filestack-js";
import AdminTabs from "../components/AdminTabs";


const AdminProductListPage = () => {

    const {data: products, isLoading, error} = useGetProductsQuery();
    const [updateProduct,
        // {error: errorUpdate}
    ] = useUpdateProductMutation();
    const [updateProductImages,
        // {error: errorUpdateImages}
    ] = useUpdateProductImagesMutation();
    const {data: token} = useGetFilestackTokenQuery();
    const [deleteProduct,
        // {error: errorDeleteProduct}
    ] = useDeleteProductMutation();
    const [deleteProductImage] = useDeleteProductImageMutation();
    const [deleteImageFromFilestack] = useDeleteImageFromFilestackMutation();
    const [encodeHandle] = useEncodeHandleMutation();

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

    const filePickerOptions = {
        accept: 'image/*',
        maxSize: 1024 * 1024,
        maxFiles: 1,
        onUploadDone: async (res) => {
            await uploadImageHandler(res.filesUploaded[0]);
            console.log(res.filesUploaded[0]);
        },
        onClose: () => {
            window.images_modal.showModal();
        }

    };
    const openPicker = async (e) => {
        const client = filestack.init(token.token, filePickerOptions);
        await client.picker(filePickerOptions).open();
    };
    const uploadImageHandler = async (object) => {
        const {handle, url} = object;
        const image = {
            productId,
            url,
            handle,
        }
        const res = await updateProductImages(image);
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
    };

    const openImagesHandler = (id) => {
        setModalIsOpen(true);
        setProductId(id);
        window.images_modal.showModal();
    };
    const closeImagesModal = (e) => {
        e.preventDefault();
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
    const submitDeleteProduct = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this product?");
        if (confirm) {
            dispatch(setLoading(true));
            try {
                /// deletes product from database
                await deleteProduct(productId);

                /// deletes product images from the cloud
                const deletedProduct = localData.filter(function (obj) {
                    return obj._id === productId;
                });
                if (deletedProduct[0].images.length !== 0) {
                    await Promise.all(deletedProduct[0].images.map(async function (image) {
                        if (image.handle !== "sampleImage") {
                            // console.log("attempting to delete images from filestack");
                            const policyAndSignature = await encodeHandle(image.handle);
                            const {policy, signature} = policyAndSignature.data;
                            const filestackData = {
                                key: token.token,
                                handle: image.handle,
                                policy,
                                signature,
                            }
                            await deleteImageFromFilestack(filestackData);
                        }

                    }));
                }

                /// deletes product from state
                setLocalData(prevState => {
                    return prevState.filter(function (obj) {
                        return obj._id !== productId
                    });
                });
            } catch (e) {
                console.log(e);
            }
        }
        dispatch(setLoading(false));
        completeEditHandler();
    }
    const deleteProductImageFromDbAndFilestack = async (id, handle) => {
        const confirm = window.confirm("Are you want to delete this image?");
        if (confirm) {
            try {
                const data = {
                    _id: productId,
                    imageId: id,
                }
                const res = await deleteProductImage(data);
                setLocalData(prevState => {
                    return prevState.map(function (obj) {
                        if (obj._id === res.data._id) {
                            return res.data;
                        } else {
                            return obj;
                        }
                    });
                });
                if (handle !== "sampleImage") {
                    const policyAndSignature = await encodeHandle(handle);
                    const {policy, signature} = policyAndSignature.data;
                    const filestackData = {
                        key: token.token,
                        handle,
                        policy,
                        signature,
                    }
                    await deleteImageFromFilestack(filestackData);
                }
            } catch (e) {
                console.log(e)
            }
        }
    }


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
                <AdminTabs/>
                <div className={"mt-5 border-2 border-neutral/90 card bg-base-100 shadow-xl"}>
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
                                                            <th className={"bg-blue-200"}>{index+1}</th>
                                                            <td className={"bg-blue-200"}>{item._id.substring(item._id.length - 6, item._id.length)}</td>
                                                        {/*<td><input type={"text"} value={item.name}/></td>*/}
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <input
                                                                    className="pl-1 py-2 shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-16 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    type={"text"}
                                                                    value={brand}
                                                                    onChange={(e) => setBrand(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-24 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    type={"text"}
                                                                    value={model}
                                                                    onChange={(e) => setModel(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-20 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    type={"number"}
                                                                    min={0}
                                                                    value={price}
                                                                    onChange={(e) => setPrice(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-12 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    type={"number"}
                                                                    min={0}
                                                                    value={inStock}
                                                                    onChange={(e) => setInStock(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 bg-blue-200"}>
                                                                <input
                                                                    className="pl-1 shadow appearance-none border rounded w-[90px] py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    type={"text"}
                                                                    value={category}
                                                                    onChange={(e) => setCategory(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 pt-2 bg-blue-200"}>
                                                                <textarea
                                                                    className="pl-1 shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                    value={description}
                                                                    onChange={(e) => setDescription(e.target.value)}
                                                                />
                                                            </td>
                                                            <td className={"p-1 w-24 bg-blue-200"}>{item?.createdAt.substring(0, 10)}</td>
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
                                                    <div key={image._id}>
                                                        <div className={"flex flex-col items-center"}>
                                                            <div className={"flex max-w-full"}>
                                                                <img className={"rounded-xl w-56"} src={image.url} alt={"product"}/>
                                                                <div className={"flex items-center pl-5"}>
                                                                    <button
                                                                        type={"button"}
                                                                        onClick={() => deleteProductImageFromDbAndFilestack(image._id, image.handle)}
                                                                        className={"btn-xs rounded-full btn-error text-white"}>
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
                                    <button onClick={openPicker} className={"btn rounded-xl"}>Add Image</button>
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