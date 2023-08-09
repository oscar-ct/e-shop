import React from 'react';
import {addToCart} from "../slices/cartSlice";
import {useDispatch} from "react-redux";
import axios from "axios";
import {Link} from "react-router-dom";
import {toast} from "react-hot-toast"


const ProfileOrderItemProduct = ({product, index, orderSize}) => {
    const dispatch = useDispatch();
    const quantity = 1;
    const addToCartHandler = async () => {
        toast.success("Added To Cart")
        const { data } = await axios.get(`/api/products/${product.productId}`);
        dispatch(addToCart({
            ...data, quantity
        }));
    }

    return (
        <>
            <div className={"py-3 pl-5"}>
                <div className={"flex flex-col lg:flex-row"}>
                    <div className={"w-full"}>
                        <div className={"flex pb-2"}>
                            <div className="w-3/12">
                                <Link to={`/product/${product.productId}`} className="bg-zinc-100/70 rounded-md w-full h-full flex items-center justify-center">
                                    <img src={product.images.length !== 0 ? product.images[0].url : "/images/sample.jpg"}  alt={"product"} className="rounded-md object-scale-down max-h-36"/>
                                </Link>
                            </div>
                            <div className={"flex flex-col w-9/12 pl-5 "}>
                                <Link to={`/product/${product.productId}`} className={"hover:link hover:link-primary font-bold"}>
                                    {product.name}
                                </Link>
                                <div className={"flex pt-2"}>
                                    <span className={"text-xs"}>
                                        ${product.price}/ea
                                    </span>
                                    <span className={"pl-10 text-xs"}>
                                        Qty: {product.quantity}
                                    </span>
                                </div>
                                <div className={"pt-4"}>
                                    <button onClick={() => addToCartHandler()} className={"btn btn-sm btn-primary shadow-blue w-36"}>
                                        Buy it again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                index+1 !== orderSize && (
                    <div className={"lg:border-b-[1px] lg:border-gray-300 px-5"}/>
                )
            }
        </>
    );
};

export default ProfileOrderItemProduct;