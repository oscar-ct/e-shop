import React, {useState} from 'react';
import {
    useCreateProductMutation, useDeleteProductImageMutation, useUpdateProductImagesMutation,
} from "../slices/productsApiSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setLoading} from "../slices/loadingSlice";
import {FaTrash, FaUpload} from "react-icons/fa";
import * as filestack from "filestack-js";
import {useGetFilestackTokenQuery, useDeleteImageFromFilestackMutation, useEncodeHandleMutation} from "../slices/filestackSlice";
import {toast} from "react-hot-toast";
import {ReactComponent as Images} from "../icons/add-image.svg";
import BackButton from "../components/BackButton";



const AdminCreateProductPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [createProduct,
        // {error: errorCreate}
    ] = useCreateProductMutation();
    const [updateProductImages,
        // {error: errorUpdateImages}
    ] = useUpdateProductImagesMutation();
    const {data: token} = useGetFilestackTokenQuery();
    const [deleteProductImage] = useDeleteProductImageMutation();
    const [deleteImageFromFilestack,
        // {error: errorDeleteFilestack}
    ] = useDeleteImageFromFilestackMutation();
    const [encodeHandle,
        // {error: errorEncodeHandle}
    ] = useEncodeHandleMutation();
    
    // const {userData} = useSelector(function (state) {
    //     return state.auth;
    // });

    const initialState = {
        name: "",
        brand: "",
        model: "",
        description: "",
        countInStock: 0,
        price: 0,
        category: "",
        color: "",
    };
    const [newProduct, setNewProduct] = useState(null);
    const [formData, setFormData] = useState(initialState);
    const [imagesUploaded, setImagesUploaded] = useState(false);

    const deleteProductImageFromDbAndFilestack = async (id, handle) => {
        const confirm = window.confirm("Are you want to delete this image?");
        if (confirm) {
            try {
                const data = {
                    imageId: id,
                    productId: newProduct._id
                }
                const res = await deleteProductImage(data);
                setNewProduct(res.data);
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

    const onMutate = (e) => {
        setFormData(prevState => {
            return {
                ...prevState,
                [e.target.id]: e.target.value,
            };
        });
    };

    const createProductHandler = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        const product = {
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            description: formData.description,
            countInStock: formData.countInStock,
            price: formData.price,
            category: formData.category,
            color: formData.color,
            // images: [{url: "/images/sample.jpg", handle: "sampleImage"}],
        }
        try {
            const res = await createProduct(product);
            toast.success("Successfully created new listing!")
            // console.log(res.data);
            setNewProduct(res.data);
        } catch (e) {
            console.log(e);
        }
        // refetch(); // this is for re-fetching data upon product creation
        // setFormData(initialState);
        dispatch(setLoading(false));
        // navigate("/admin/products");
    };


    const filePickerOptions = {
        accept: 'image/*',
        maxSize: 1024 * 1024,
        maxFiles: 1,
        onUploadDone: async (res) => {
            await uploadImageHandler(res.filesUploaded[0]);
            setImagesUploaded(true);
            // console.log(res.filesUploaded[0]);
        },
        // onClose: () => {
        //    console.log("close")
        // }

    };
    const openPicker = async () => {
        const client = filestack.init(token.token, filePickerOptions);
        await client.picker(filePickerOptions).open();
    };
    const uploadImageHandler = async (object) => {
        dispatch(setLoading(true));
        const {handle, url} = object;
        const image = {
            productId: newProduct._id,
            url,
            handle,
        };
        const res = await updateProductImages(image);
        if (res) {
            setNewProduct(res.data);
        }
        dispatch(setLoading(false));
    };

    return (
        <>
           <BackButton/>
            <div className={"2xl:px-20"}>
                <div className={"bg-base-100 shadow-xl px-12 py-7 mx-auto rounded-2xl w-full"}>
                    <h2 className={"mb-2 text-2xl text-center py-2 rounded-xl border-b-[1px] border-gray-300"}>
                        New Product Listing
                    </h2>
                    <h2 className={"pt-5 lg:pt-0 text-xl font-bold flex items-center"}>
                        Step 1.
                        {
                            newProduct === null ? (
                                <span className="pl-3 text-sm text-gray-500 font-normal">
                                    Please fill in all text fields
                                </span>
                            ) : (
                                <div className="flex items-center pl-3 text-sm text-green-500 font-semibold">
                                    <span className={"pr-1"}>
                                        Complete!
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            )
                        }

                    </h2>

                    <form onSubmit={createProductHandler} className={"rounded-xl w-full pb-5 pt-3 border-neutral-400 border-dotted border-b-2"}>
                        <div className={"flex flex-col lg:flex-row"}>
                            <div className={"w-full flex flex-col lg:w-6/12 sm:px-10 lg:pr-10 lg:pl-5"}>
                                <div className={"space-y-2 pb-2"}>
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">Title
                                    </label>
                                    <input
                                        className={`w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                        autoComplete={"off"}
                                        type={"text"}
                                        placeholder={"e.g. Brand, model name, color, and size"}
                                        id={"name"}
                                        value={formData.name}
                                        onChange={onMutate}
                                        disabled={newProduct !== null}
                                        required
                                    />
                                </div>
                                <div className={"space-y-2 pb-2"}>
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">Description
                                    </label>
                                    <textarea
                                        className={`w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                        autoComplete={"off"}
                                        placeholder={"Tell customers more about your details about the product"}
                                        id={"description"}
                                        value={formData.description}
                                        required
                                        rows={5}
                                        disabled={newProduct !== null}
                                        onChange={onMutate}
                                    />
                                </div>
                            </div>
                            <div className={"w-full flex flex-col lg:w-6/12 sm:px-10 lg:pr-10 lg:pl-5"}>
                                <div className={"flex flex-col lg:flex-row"}>
                                    <div className={"w-full flex flex-col lg:w-6/12 lg:px-2"}>
                                        <div className={"space-y-2 pb-2"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">Brand
                                            </label>
                                            <input
                                                className={`w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                                autoComplete={"off"}
                                                type={"text"}
                                                placeholder={"e.g. Sony"}
                                                id={"brand"}
                                                value={formData.brand}
                                                onChange={onMutate}
                                                disabled={newProduct !== null}
                                                required
                                            />
                                        </div>
                                        <div className={"space-y-2 pb-2"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">Model Number
                                            </label>
                                            <input
                                                className={`w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                                autoComplete={"off"}
                                                type={"text"}
                                                placeholder={"e.g. KDL-32BX330"}
                                                id={"model"}
                                                value={formData.model}
                                                onChange={onMutate}
                                                disabled={newProduct !== null}
                                                required
                                            />
                                        </div>
                                        <div className={"space-y-2 pb-2"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">Category
                                            </label>
                                            <input
                                                className={`w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                                autoComplete={"off"}
                                                type={"text"}
                                                placeholder={"e.g. Electronics"}
                                                id={"category"}
                                                value={formData.category}
                                                onChange={onMutate}
                                                disabled={newProduct !== null}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className={"w-full flex flex-col lg:w-6/12 lg:px-2"}>
                                        <div className={"w-full flex flex-row lg:flex-col"}>
                                            <div className={"w-full pr-5 lg:pr-0 space-y-2 pb-2"}>
                                                <label className="text-sm font-medium text-gray-700 tracking-wide">Qty In Stock
                                                </label>
                                                <input
                                                    className={`w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                                    autoComplete={"off"}
                                                    type={"number"}
                                                    placeholder={"Product Brand"}
                                                    id={"countInStock"}
                                                    value={formData.countInStock}
                                                    onChange={onMutate}
                                                    disabled={newProduct !== null}
                                                    required
                                                />
                                            </div>
                                            <div className={"w-full pl-5 lg:pl-0 space-y-2 pb-2"}>
                                                <label className="text-sm font-medium text-gray-700 tracking-wide">List Price
                                                </label>
                                                <input
                                                    className={`w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                                    autoComplete={"off"}
                                                    type={"number"}
                                                    placeholder={"Product Model"}
                                                    id={"price"}
                                                    value={formData.price}
                                                    onChange={onMutate}
                                                    disabled={newProduct !== null}
                                                    required
                                                />
                                            </div>
                                        </div>


                                        <div className={"space-y-2 pb-2"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">Color
                                            </label>
                                            <input
                                                className={`w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                                autoComplete={"off"}
                                                type={"text"}
                                                placeholder={"e.g. Silver"}
                                                id={"color"}
                                                value={formData.color}
                                                onChange={onMutate}
                                                disabled={newProduct !== null}
                                                required
                                            />
                                        </div>
                                        {/*<div className={"space-y-2 pb-2 w-6/12 lg:w-full pr-5 lg:pr-0"}>*/}
                                        {/*    <label className="text-sm font-medium text-gray-700 tracking-wide">Posted By*/}
                                        {/*    </label>*/}
                                        {/*    <input*/}
                                        {/*        className={`input input-bordered w-full ${newProduct && "border-none bg-base-100 font-semibold"}`}*/}
                                        {/*        autoComplete={"off"}*/}
                                        {/*        type={"text"}*/}
                                        {/*        disabled={true}*/}
                                        {/*        value={userData.name}*/}
                                        {/*    />*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`px-5 sm:px-0 pt-5 w-full flex flex-col lg:flex-row lg:justify-end items-center`}>

                            <button disabled={newProduct !== null} type={"submit"} className={`rounded-xl ${newProduct === null && "shadow-blue"} self-end btn btn-primary w-full lg:btn-wide`}>
                               Create Listing
                            </button>

                        </div>
                    </form>

                    <h2 className={"pt-10 lg:pt-5 text-xl font-bold"}>Step 2.
                        {
                            newProduct === null ? (
                                <span className={"pl-2 text-lg text-gray-500 text-sm font-normal"}>
                                    Add product images
                                </span>
                            ) : (
                                <span className={"pl-2 text-lg text-neutral text-sm font-normal"}>
                                    Add product images ({newProduct.images.length}/7)
                                </span>
                            )
                        }

                    </h2>

                    <div className={"flex justify-center flex-wrap"}>
                        {
                            newProduct && newProduct.images.length !== 0 ? newProduct.images.map(function (imageObj, index) {
                                return (
                                    <div key={index} className={"p-3"}>
                                        <div className={"indicator"}>
                                            <span onClick={() => deleteProductImageFromDbAndFilestack(imageObj._id, imageObj.handle)} className="p-1 text-white indicator-item rounded-full badge badge-error cursor-pointer">
                                                <FaTrash className={"text-xs"}/>
                                            </span>
                                            <img src={imageObj.url} alt={"product"} className={"w-40 rounded-xl"}/>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className={"pt-5"}>
                                    <button disabled={newProduct === null} onClick={openPicker}>
                                        <Images fill={newProduct === null ? "#D3D3D38E" : "rgba(216,228,253,0.99)"} height={"100px"} width={"100px"}/>
                                    </button>
                                </div>
                            )
                        }
                    </div>

                    <div className={"px-5 sm:px-0 py-5 w-full flex flex-col lg:flex-row lg:justify-between"}>
                        <p className={"text-xs py-1 text-center"}>
                            * Please note the first uploaded image will be the cover
                        </p>
                        <button disabled={newProduct === null || newProduct.images.length >= 7} onClick={openPicker} className={"rounded-xl btn w-full lg:btn-wide"}>
                            <FaUpload/>
                            Upload Image
                        </button>
                    </div>

                </div>
                {
                    imagesUploaded && (
                        <div className={"py-10 px-5 lg:px-0 flex justify-center"}>
                            <button onClick={() => navigate("/admin/products")} className={"item-center btn btn-success rounded-xl"}>
                                Finished
                            </button>
                        </div>
                    )
                }

            </div>

        </>
    );
};

export default AdminCreateProductPage;