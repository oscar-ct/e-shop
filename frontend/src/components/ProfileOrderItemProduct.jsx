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
            <div className={"py-5 px-5"}>
                <div className={"flex flex-col lg:flex-row"}>
                    <div className={"w-full"}>
                        <div className={"flex bg-base-100 pb-3"}>
                            <div className="avatar pr-5">
                                <Link to={`/product/${product.productId}`} className="rounded-xl w-24 h-24">
                                    <img src={product.images.length !== 0 ? product.images[0].url : "/images/sample.jpg"}  alt={"product"}/>
                                </Link>
                            </div>
                            <div className={"flex flex-col"}>
                                <Link to={`/product/${product.productId}`} className={"hover:link hover:link-primary font-bold"}>
                                    {product.name}
                                </Link>
                                <div className={"flex"}>
                                    <span className={"text-xs"}>
                                        ${product.price}/ea
                                    </span>
                                    <span className={"pl-10 text-xs"}>
                                        Qty: {product.quantity}
                                    </span>
                                </div>
                                <div className={"pt-5"}>
                                    <button onClick={() => addToCartHandler()} className={"btn btn-sm btn-warning w-36"}>
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
                    <div className={"border-b-[1px] border-gray-300 mx-5"}/>
                )
            }
        </>
    );
};

export default ProfileOrderItemProduct;