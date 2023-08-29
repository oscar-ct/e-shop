import React, {useEffect, useState} from 'react';
import Spinner from "../components/Spinner";
import {FaCheckCircle, FaEdit, FaImages, FaMinusCircle, FaTimes, FaPlus} from "react-icons/fa";
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
import {useParams} from "react-router-dom";
import Paginate from "../components/Paginate";
import AlertModal from "../components/AlertModal";
import ConfirmModal from "../components/ConfirmModal";
import Meta from "../components/Meta";


const AdminProductListPage = () => {
    const {pageNumber} = useParams();
    const {data, isLoading, refetch, error} = useGetProductsQuery({pageNumber});
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

    const [localData, setLocalData] = useState(data?.products ? data.products : null);
    const [editMode, setEditMode] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [productId, setProductId] = useState(null);
    const [name, setName] = useState(null);
    const [model, setModel] = useState(null);
    const [brand, setBrand] = useState(null);
    const [color, setColor] = useState(null);
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
    const openPicker = async () => {
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
        await updateProductImages(image).unwrap();
        refetch();
        // if (res) {
        //     setLocalData(prevState => {
        //         return prevState.map(function (obj) {
        //             if (obj._id === res._id) {
        //                 return res;
        //             } else {
        //                 return obj;
        //             }
        //         });
        //     });
        // }
    };

    const openImagesModal = (id) => {
        setModalIsOpen(true);
        setProductId(id);
        window.images_modal.showModal();
    };
    const closeImagesModal = (e) => {
        e.preventDefault();
        window.images_modal.close();
        setModalIsOpen(false);
        setProductId(null);
    };
    const submitUpdateHandler = async (e) => {
        e.preventDefault();
        window.confirm_modal.close();
        const updatedProduct = {
            productId,
            name,
            brand,
            model,
            price,
            countInStock: inStock,
            category,
            description,
            color,
        }
        dispatch(setLoading(true));
        try {
            await updateProduct(updatedProduct);
            refetch();
            // if (res) {
            //     setLocalData(prevState => {
            //         return prevState.map(function (obj) {
            //             if (obj._id === res.data._id) {
            //                 return res.data;
            //             } else {
            //                 return obj;
            //             }
            //         });
            //     });
            // }
        } catch (e) {
            console.log(e);
        }
        dispatch(setLoading(false));
        completeEditHandler();
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
        setColor(null);
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
        setColor(obj.color);
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
            color,
            price,
            countInStock: inStock.toString(),
            category,
            description,
        }
        const a = {
            name: updatedObj.name,
            brand: updatedObj.brand,
            model: updatedObj.model,
            color: updatedObj.color,
            price: updatedObj.price,
            countInStock: updatedObj.countInStock.toString(),
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
    const submitDeleteProduct = async () => {
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
            refetch();
            // setLocalData(prevState => {
            //     return prevState.filter(function (obj) {
            //         return obj._id !== productId
            //     });
            // });
        } catch (e) {
            console.log(e);
        }
        dispatch(setLoading(false));
        completeEditHandler();
    }
    const deleteProductImageFromDbAndFilestack = async (id, handle) => {
        const confirm = window.confirm("Are you want to delete this image?");
        if (confirm) {
            const data = {
                imageId: id,
                productId: productId
            }
            try {
                await deleteProductImage(data).unwrap();
                refetch();
                // setLocalData(prevState => {
                //     return prevState.map(function (obj) {
                //         console.log(obj)
                //         if (obj._id === res._id) {
                //             return res;
                //         } else {
                //             return obj;
                //         }
                //     });
                // });
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
        // if (data) {
        //     if (!localData) {
                setLocalData(data?.products);
        //     }
        // }
    }, [data?.products, localData]);

   const openConfirmDeleteProductModal = () => {
        window.alert_modal.showModal();
   };

    return (
        isLoading || !localData ? <Spinner/> : error ? error : (
            <>
                <Meta title={"Product List"}/>
                <div className={"py-10"}>
                    <AdminTabs/>
                    <div className={"mt-5 card bg-white shadow-xl"}>
                        <div className={"w-full px-5 flex justify-center py-5"}>
                            <div className={"text-2xl"}>
                                Products ({localData.length})
                                <button
                                    onClick={() => navigate("/admin/products/create")}
                                    className={"absolute right-6 self-end btn btn-info btn-sm"}
                                >
                                    <FaPlus/>
                                </button>
                            </div>

                        </div>
                        <div className="overflow-x-auto p-5">
                            <table className="table table-zebra w-full table-xs">
                                <thead>
                                <tr>
                                    <th/>
                                    {/*<th>ID</th>*/}
                                    <th className={"p-1"}>Name</th>
                                    <th className={"p-1"}>Brand</th>
                                    <th className={"p-1"}>Model</th>
                                    <th className={"p-1"}>Color</th>
                                    <th className={"p-1"}>Price</th>
                                    <th className={"p-1"}>Stock</th>
                                    <th className={"p-1"}>Category</th>
                                    <th className={"p-1"}>Description</th>
                                    <th className={"p-1"}>List date</th>
                                    <th/>
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
                                                                {/*<td className={"bg-blue-200"}>{item._id.substring(item._id.length - 6, item._id.length)}</td>*/}
                                                                <td className={"p-1 pt-2 bg-blue-200"}>
                                                                    <textarea
                                                                        className="bg-white pl-1 shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        // className="pl-1 py-2 shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        value={name}
                                                                        onChange={(e) => setName(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <input
                                                                        className="bg-white pl-1 shadow appearance-none border rounded w-16 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        type={"text"}
                                                                        value={brand}
                                                                        onChange={(e) => setBrand(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <input
                                                                        className="bg-white pl-1 shadow appearance-none border rounded w-24 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        type={"text"}
                                                                        value={model}
                                                                        onChange={(e) => setModel(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <input
                                                                        className="bg-white pl-1 shadow appearance-none border rounded w-16 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        type={"text"}
                                                                        value={color}
                                                                        onChange={(e) => setColor(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <input
                                                                        className="bg-white pl-1 shadow appearance-none border rounded w-[65px] py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        type={"number"}
                                                                        min={0}
                                                                        value={price}
                                                                        onChange={(e) => setPrice(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <input
                                                                        className="bg-white pl-1 shadow appearance-none border rounded w-[40px] py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        type={"number"}
                                                                        min={0}
                                                                        value={inStock}
                                                                        onChange={(e) => setInStock(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className={"p-1 bg-blue-200"}>
                                                                    <input
                                                                        className="bg-white pl-1 shadow appearance-none border rounded w-[90px] py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        type={"text"}
                                                                        value={category}
                                                                        onChange={(e) => setCategory(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className={"p-1 pt-2 bg-blue-200"}>
                                                                    <textarea
                                                                        className="bg-white pl-1 shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-primary"
                                                                        value={description}
                                                                        onChange={(e) => setDescription(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td className={"p-1 w-20 bg-blue-200 truncate"}>{item?.createdAt.substring(0, 10)}</td>
                                                                <td className={"p-1 w-20 bg-blue-200"}>
                                                                    <div className={"flex justify-center items-center"}>
                                                                        <div className="tooltip tooltip-bottom" data-tip="save">
                                                                            <button onClick={confirmUpdateHandler} className={"text-green-500 btn-glass btn-xs rounded-full"}>
                                                                                <FaCheckCircle className={"text-sm"}/>
                                                                            </button>
                                                                        </div>
                                                                        <div className="tooltip tooltip-bottom" data-tip="delete">
                                                                            <button onClick={() => openConfirmDeleteProductModal()} className={"text-red-500 btn-glass btn-xs rounded-full"}>
                                                                                <FaMinusCircle className={"text-sm"}/>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                            <th>{index+1}</th>
                                                            {/*<td>{item._id.substring(item._id.length - 6, item._id.length)}*/}
                                                            {/*</td>*/}
                                                            <td className={"p-1 w-64"}><Link className={"link link-primary"} to={`/product/${item._id}`}>
                                                                {item.name.substring(0, 42)}
                                                            </Link></td>
                                                            <td className={"p-1"}>{item.brand}</td>
                                                            <td className={"p-1"}>{item.model}</td>
                                                            <td className={"p-1"}>{item.color}</td>
                                                            <td className={"p-1"}>${item.price}</td>
                                                            <td className={"p-1"}>{item.countInStock !== 0 ? item.countInStock : <FaTimes fill={"red"}/>}</td>
                                                            <td className={"p-1"}>{item.category}</td>
                                                            <td className={"p-1 w-48 text-clip"}>{item.description.substring(0, 48)}...</td>
                                                            <td className={"w-20 p-1"}>{item?.createdAt.substring(0, 10)}</td>
                                                            <td className={"p-2"}>
                                                                <div className={"flex justify-end items-center"}>
                                                                    <button
                                                                        onClick={() => editProductHandler(item._id)}
                                                                        className={"btn-glass btn-xs rounded-full hover:text-primary"}
                                                                    >
                                                                        <FaEdit className={"text-sm"}/>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openImagesModal(item._id)}
                                                                        className={`btn-glass btn-xs rounded-full hover:text-primary ${editMode && "hidden"}`}
                                                                    >
                                                                        <FaImages className={"text-sm"}/>
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


                        <div className={"pt-4 lg:pt-0 pb-8 flex justify-center"}>
                            <div className={"join"}>
                                <Paginate pages={data.pages} page={data.page} isAdmin={true}/>
                            </div>
                        </div>

                    </div>


                   {/*MODALS BELOW */}

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

                    <dialog id="images_modal" className="modal modal-bottom sm:modal-middle">
                        {
                            modalIsOpen && (
                                <form method="dialog" className="modal-box bg-white">
                                    <div className="px-2 pt-2">
                                        <h2 className={"pb-5 text-center text-xl"}>{localData.find((x) => x._id === productId).name}</h2>
                                        {
                                            localData.find((x) => x._id === productId).images.length !== 0 ? (
                                                localData.find((x) => x._id === productId).images.map(function (image) {
                                                    return (
                                                        <div key={image._id}>
                                                            <div className={"flex"}>
                                                                <div className={"w-11/12 py-2"}>
                                                                    <img className={"rounded-xl w-full"} src={image.url} alt={"product"}/>
                                                                </div>
                                                                <div className={"w-1/12 flex justify-end items-center"}>
                                                                    <button
                                                                        onClick={async (e) => {
                                                                            e.preventDefault();
                                                                            await deleteProductImageFromDbAndFilestack(image._id, image.handle)
                                                                        }}
                                                                        className={"text-red-500 rounded-full text-xl"}>
                                                                        <FaMinusCircle/>
                                                                    </button>
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
                                        <button className={"btn btn-neutral rounded-xl"} onClick={closeImagesModal}>Cancel</button>
                                        <button onClick={openPicker} className={"btn rounded-xl"}>Add Image</button>
                                    </div>
                                </form>

                            )
                        }
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>

                    <AlertModal title={"Delete Product"} initiateFunction={() => submitDeleteProduct()}>
                        <div className={"flex flex-col"}>
                            <p>
                                Are you sure you want to delete this product?
                                <span className={"pl-2 text-red-600 font-semibold"}>
                                    This cannot be undone.
                                </span>
                            </p>
                            <p className={"pt-3 text-center font-bold text-lg"}>
                                {name}
                            </p>
                        </div>
                    </AlertModal>

                </div>
            </>
        )
    );
};

export default AdminProductListPage;