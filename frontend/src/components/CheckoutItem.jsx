import React from 'react';
import {Link} from "react-router-dom";
import {FaTrash} from "react-icons/fa";
import {addToCart, removeFromCart} from "../slices/cartSlice";
import {useDispatch} from "react-redux";
import {formatPrice} from "../utils/formatPriceUtilis";

const CheckoutItem = ( {item} ) => {

    const dispatch = useDispatch();
    const addToCartHandler = async (item, quantity) => {
        dispatch(addToCart({
            ...item, quantity
        }));
    };
    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id));
    };

    return (
        <>
            <div className={"flex w-full mt-5"}>

                <div className={"w-2/12"}>
                    <Link to={`/product/${item._id}`}>
                        <img className={"lg:w-32 rounded-xl"} src={item.images.length !== 0 ? item.images[0].url : "/images/sample.jpg"} alt={"cartItem"}/>
                    </Link>
                </div>

                <div className={"w-8/12 flex flex-col px-3 sm:px-5"}>

                    <Link to={`/product/${item._id}`} className={"sm:text-lg font-bold text-neutral hover:link hover:link-primary"}>
                        {item.name}
                    </Link>

                    <div className={"flex w-full"}>
                        <div className={"flex flex-col w-9/12"}>
                            <div>
                                <span className={"text-gray-500 font-bold text-xs"}>
                                    Brand:
                                </span>
                                <span className={"ml-1 text-sm"}>
                                    {item.brand}
                                </span>
                            </div>
                            <div>
                                <span className={"text-gray-500 font-bold text-xs"}>
                                    Remaining In Stock:
                                </span>
                                <span className={"ml-1 text-sm"}>
                                    {item.countInStock}
                                </span>
                            </div>
                            <div>
                                <span className={"text-gray-500 font-bold text-xs"}>
                                    Price:
                                </span>
                                <span className={"ml-1 text-sm"}>
                                    ${item.price}/ea
                                </span>
                            </div>
                        </div>

                        <div className={"w-3/12 flex justify-end items-end"}>

                            <div className={"flex justify-end items-end"}>
                                <label className="block mr-2 text-sm font-medium text-gray-900 dark:text-white pb-3">
                                    Qty:
                                </label>
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={item.quantity}
                                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                >
                                    {
                                        [...Array(item.countInStock).keys()].map(function (x) {
                                            return (
                                                <option key={x+1} value={x+1}>
                                                    {x+1}
                                                </option>
                                            )
                                        })
                                    }
                                </select>

                            </div>
                        </div>
                    </div>
                </div>

                <div className={"w-2/12 flex flex-col items-end justify-between"}>
                {
                    formatPrice(item.price * item.quantity, "text-xl")
                }
                    <div>
                        <button
                            onClick={() => removeFromCartHandler(item._id)}
                            className={"btn btn-xs rounded-full"}
                        >
                            <FaTrash className={"text-red-500 text-md"}/>
                        </button>
                    </div>
                </div>
            </div>
            <div className={"mt-5 border-b-[1px] border-gray-300"}/>
        </>

    );
};

export default CheckoutItem;