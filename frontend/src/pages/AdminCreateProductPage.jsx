import React, {useState} from 'react';
import {
    useCreateProductMutation, useDeleteProductImageMutation, useUpdateProductImagesMutation,
} from "../slices/productsApiSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setLoading} from "../slices/loadingSlice";
import {FaTrash, FaUpload} from "react-icons/fa";
import * as filestack from "filestack-js";
import {useGetFilestackTokenQuery, useDeleteImageFromFilestackMutation, useEncodeHandleMutation} from "../slices/filestackSlice";


const AdminCreateProductPage = () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();

 
    const [createProduct, {error: errorCreate}] = useCreateProductMutation();
    const [updateProductImages, {error: errorUpdateImages}] = useUpdateProductImagesMutation();
    const {data: token} = useGetFilestackTokenQuery();
    const [deleteProductImage] = useDeleteProductImageMutation();
    const [deleteImageFromFilestack, {error: errorDeleteFilestack}] = useDeleteImageFromFilestackMutation();
    const [encodeHandle, {error: errorEncodeHandle}] = useEncodeHandleMutation();
    
    const {userData} = useSelector(function (state) {
        return state.auth;
    });

    const initialState = {
        name: "",
        brand: "",
        model: "",
        description: "",
        countInStock: 0,
        price: 0,
        category: "",
    };
    const [newProduct, setNewProduct] = useState(null);
    const [formData, setFormData] = useState(initialState);
    const [imagesUploaded, setImagesUploaded] = useState(false);

    const deleteProductImageFromDbAndFilestack = async (id, handle) => {
        const confirm = window.confirm("Are you want to delete this image?");
        if (confirm) {
            try {
                const data = {
                    _id: newProduct._id,
                    imageId: id,
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
            images: [{url: "/images/sample.jpg", handle: "sampleImage"}],
        }
        try {
            const res = await createProduct(product);
            console.log(res.data);
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
            <div className={"pt-10 2xl:px-20"}>
                <div className={"bg-base-100 shadow-xl px-12 py-6 mx-auto rounded-2xl w-full"}>
                    <h2 className={"text-2xl text-center font-bold pb-5"}>New Product Listing</h2>
                    <h2 className={"text-xl font-bold"}>Step 1 <span className={"text-red-500 text-lg"}>(required)</span></h2>
                    <p className="text-sm text-gray-500">Please fill in all text fields.
                    </p>
                    <form onSubmit={createProductHandler} className={"w-full py-2"}>
                        <div className={"flex flex-col lg:flex-row"}>
                            <div className={"w-full flex flex-col lg:w-6/12 sm:px-10 lg:pr-10 lg:pl-5"}>
                                <div className={"space-y-2 pb-2"}>
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">Name
                                    </label>
                                    <input
                                        className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"off"}
                                        type={"text"}
                                        placeholder={"Product Name"}
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
                                        className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"off"}
                                        placeholder={"Product Description"}
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
                                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                autoComplete={"off"}
                                                type={"text"}
                                                placeholder={"Product Brand"}
                                                id={"brand"}
                                                value={formData.brand}
                                                onChange={onMutate}
                                                disabled={newProduct !== null}
                                                required
                                            />
                                        </div>
                                        <div className={"space-y-2 pb-2"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">Model
                                            </label>
                                            <input
                                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                autoComplete={"off"}
                                                type={"text"}
                                                placeholder={"Product Model"}
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
                                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                autoComplete={"off"}
                                                type={"text"}
                                                placeholder={"Product Category"}
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
                                                    className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
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
                                                <label className="text-sm font-medium text-gray-700 tracking-wide">Price
                                                </label>
                                                <input
                                                    className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
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
                                        <div className={"space-y-2 pb-2 w-6/12 lg:w-full pr-5 lg:pr-0"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">Posted By
                                            </label>
                                            <input
                                                className="input input-bordered w-full"
                                                autoComplete={"off"}
                                                type={"text"}
                                                disabled={true}
                                                value={userData.name}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"px-5 sm:px-0 pt-5 w-full flex flex-col lg:flex-row lg:justify-end"}>
                            {
                                newProduct && (
                                    <h1 className={"w-full text-sm lg:text-lg text-start font-bold lg:pb-0 pb-5"}>
                                        <span className={"text-green-600 text-2xl pr-2"}>
                                            Success!
                                        </span>
                                        Product Id: {newProduct._id}
                                    </h1>
                                )
                            }
                            <button type={"submit"} className={"btn btn-primary w-full lg:btn-wide"}>
                                Create Listing
                            </button>

                        </div>
                    </form>

                    <h2 className={"pt-10 lg:pt-0 text-xl font-bold"}>Step 2 <span className={"text-lg text-gray-500"}>(recommended)</span></h2>
                    <p className="text-sm text-gray-500">Add images to your product.
                    </p>

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
                                <h1 className={"py-10 font-bold text-lg text-gray-500"}>By default a sample image will be uploaded when creating a new product listing</h1>
                            )
                        }
                    </div>

                    <div className={"px-5 sm:px-0 py-5 w-full lg:flex lg:justify-end"}>
                        <button disabled={newProduct === null} onClick={openPicker} className={"btn w-full lg:btn-wide"}>
                            <FaUpload/>
                            Upload File
                        </button>
                    </div>

                </div>
                {
                    imagesUploaded && (
                        <div className={"py-10 px-5 lg:px-0 lg:flex lg:justify-center"}>
                            <button onClick={() => navigate("/admin/products")} className={"btn btn-success w-full lg:btn-wide rounded-xl"}>
                                Done
                            </button>
                        </div>
                    )
                }

            </div>

        </>
    );
};

export default AdminCreateProductPage;