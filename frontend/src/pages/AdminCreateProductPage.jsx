import {useState} from "react";
import {
    useCreateProductMutation, useDeleteProductImageMutation, useUpdateProductImagesMutation,
} from "../slices/productsApiSlice";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {setLoading} from "../slices/loadingSlice";
import {FaTrash, FaUpload} from "react-icons/fa";
import * as filestack from "filestack-js";
import {useGetFilestackTokenQuery, useDeleteImageFromFilestackMutation, useEncodeHandleMutation} from "../slices/filestackSlice";
import {toast} from "react-hot-toast";
import {ReactComponent as Images} from "../icons/add-image.svg";
import Meta from "../components/Meta";
import CategoryOptions from "../components/CategoryOptions";
import AdminTabs from "../components/AdminTabs";
import CustomBtn from "../components/CustomBtn";



const AdminCreateProductPage = () => {

    const dispatch = useDispatch();

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
        countInStock: "0",
        price: "0",
        category: "",
        color: "",
    };
    const [newProduct, setNewProduct] = useState(null);
    const [formData, setFormData] = useState(initialState);
    const [imagesUploaded, setImagesUploaded] = useState(false);

    const formIsComplete = formData.name !== "" && formData.brand !== "" && formData.model !== "" && formData.description !== "" && formData.category !== "" && formData.color !== "" && formData.countInStock !== "0" && formData.price !== "0";

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
            <Meta title={"New Product Listing"}/>
            <div className={"sm:py-10"}>
                <AdminTabs/>
                <div className={"bg-white sm:mt-5 mx-auto w-full"}>
                    <div className={"px-10 py-5 border"}>
                        <h2 className={"pt-5 text-xl font-bold"}>
                            Step 1.
                            {
                                newProduct === null ? (

                                        <span className="pl-3 text-sm text-gray-500 font-normal">Create new product listing</span>

                                ) : (
                                    <div className="flex items-center pl-3 text-sm text-green-500 font-semibold">
                                        <span className={"pr-1"}>Completed!</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                )
                            }

                        </h2>

                        <form onSubmit={createProductHandler} className={"w-full pb-5 pt-3 border-neutral-400 border-dotted border-b-2"}>
                            <div className={"flex flex-col lg:flex-row"}>
                                <div className={"w-full flex flex-col lg:w-6/12 sm:px-10 lg:pr-10 lg:pl-5"}>
                                    <div className={"space-y-2 pb-2"}>
                                        <label className="text-sm font-medium text-gray-700 tracking-wide">Title
                                        </label>
                                        <textarea
                                            className={`bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                            autoComplete={"off"}
                                            // type={"text"}
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
                                            className={`bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                            autoComplete={"off"}
                                            placeholder={"Tell customers more details about the product"}
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
                                                    className={`bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
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
                                                    className={`bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
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
                                                <select
                                                    className={`bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                                    autoComplete={"off"}
                                                    id={"category"}
                                                    // value={formData.category}
                                                    onChange={onMutate}
                                                    disabled={newProduct !== null}
                                                    required
                                                >
                                                    <CategoryOptions bool={formData.category !== ""}/>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={"w-full flex flex-col lg:w-6/12 lg:px-2"}>
                                            <div className={"w-full flex flex-row lg:flex-col"}>
                                                <div className={"w-full pr-5 lg:pr-0 space-y-2 pb-2"}>
                                                    <label className="text-sm font-medium text-gray-700 tracking-wide">Qty In Stock
                                                    </label>
                                                    <input
                                                        className={`bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                                        autoComplete={"off"}
                                                        type={"number"}
                                                        id={"countInStock"}
                                                        value={formData.countInStock}
                                                        onChange={onMutate}
                                                        disabled={newProduct !== null}
                                                        required
                                                        min={0}
                                                    />
                                                </div>
                                                <div className={"bg-white w-full pl-5 lg:pl-0 space-y-2 pb-2"}>
                                                    <label className="text-sm font-medium text-gray-700 tracking-wide">List Price
                                                    </label>
                                                    <input
                                                        className={`bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
                                                        autoComplete={"off"}
                                                        type={"number"}
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
                                                    className={`bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${newProduct && "border-none bg-base-100 font-semibold"}`}
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
                            <div className={`px-5 sm:px-0 pt-1 w-full flex flex-col lg:flex-row lg:justify-end items-center`}>
                                <CustomBtn isDisabled={newProduct !== null || !formIsComplete} type={"submit"} customClass={"self-end !px-14"}>
                                    Create Listing
                                </CustomBtn>
                            </div>
                        </form>

                        <h2 className={"pt-10 lg:pt-5 text-xl font-bold"}>Step 2.
                            {
                                newProduct === null ? (
                                    <span className={"pl-3 text-gray-500 text-sm font-normal"}>
                                        Add product images
                                    </span>
                                ) : (
                                    <span className={"pl-3 text-neutral text-sm font-normal"}>
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
                                                <span onClick={() => deleteProductImageFromDbAndFilestack(imageObj._id, imageObj.handle)} className="indicator-item cursor-pointer">
                                                    <FaTrash fill={"red"} className={"text-xs"}/>
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
                            <p className={"text-xs text-gray-500 font-normal pb-2 text-center"}>
                                Note: the first uploaded image will be the cover image
                            </p>
                            <CustomBtn isDisabled={newProduct === null || newProduct.images.length >= 7} onClick={openPicker} customClass={"!px-10"}>
                                <div className={"flex w-full justify-center items-center"}>
                                    <FaUpload/>
                                    <span className={"pl-2"}>Upload Image</span>
                                </div>

                            </CustomBtn>
                        </div>

                    </div>
                    {
                        imagesUploaded && (
                            <div className={"py-10 px-5 lg:px-0 flex justify-center"}>
                                <Link className={"link link-primary text-2xl"} to={(`/product/${newProduct._id}`)}>
                                    I&apos;m finished, take me to new product listing
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>

        </>
    );
};

export default AdminCreateProductPage;