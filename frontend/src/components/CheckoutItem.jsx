import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {FaTrash} from "react-icons/fa";
import {addToCart, removeFromCart} from "../slices/cartSlice";
import {useDispatch} from "react-redux";

const CheckoutItem = ( {item} ) => {

    const [quantity, setQuantity] = useState(1);
    const [itemUpdated, setItemUpdated] = useState(false);

    const dispatch = useDispatch();


    const addToCartHandler = async () => {
        setItemUpdated(true);
        dispatch(addToCart({
            ...item, quantity
        }));
        setTimeout(function () {
            setItemUpdated(false);
        }, 1000)
    };
    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id));
    };


    return (
        <>
            <div className={"flex w-full mt-5"}>

                <div className={"w-2/12"}>
                    <Link to={`/product/${item._id}`}>
                        <img className={"lg:w-32 rounded-sm"} src={item.image} alt={"cartItem"}/>
                    </Link>
                </div>

                <div className={"w-8/12 flex flex-col px-3 sm:px-5"}>

                    <div className={"sm:text-lg font-bold"}>
                        {item.name}
                    </div>

                    <div className={"flex w-full justify-between items-end"}>
                        <div className={"flex flex-col"}>
                            <div>
                                <span className={"font-bold text-xs"}>
                                    Brand:
                                </span>
                                <span className={"ml-1 text-sm"}>
                                    {item.brand}
                                </span>
                            </div>
                            <div>
                                <span className={"font-bold text-xs"}>
                                    Remaining In Stock:
                                </span>
                                <span className={"ml-1 text-sm"}>
                                    {item.countInStock}
                                </span>
                            </div>
                            <div>
                                <span className={"font-bold text-xs"}>
                                    Price:
                                </span>
                                <span className={"ml-1 text-sm"}>
                                    ${item.price}
                                </span>
                            </div>
                        </div>

                        <div className={"flex-col flex sm:flex-row"}>
                            <div className={"mb-1 px-1"}>
                                {/*<span className={"font-bold text-sm"}>*/}
                                {/*    Qty:*/}
                                {/*</span>*/}
                                <input
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    min={1}
                                    defaultValue={item.quantity}
                                    max={item.countInStock}
                                    type="number"
                                    className="input input-bordered"
                                />
                            </div>
                            <div className={"flex justify-center items-center"}>
                                {
                                    !itemUpdated ? (
                                        <button
                                            onClick={addToCartHandler}
                                            className={"btn btn-xs"}>
                                            Update
                                        </button>
                                    ) : (
                                        <button
                                            className={"btn btn-success btn-xs"}>
                                            Updated!
                                        </button>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                </div>

                <div className={"w-2/12 flex flex-col items-end justify-between"}>
                    <span className={"text-lg font-bold"}>
                        ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <div>
                        <button
                            onClick={() => removeFromCartHandler(item._id)}
                            className={"btn btn-xs"}
                        >
                            <FaTrash className={"text-md"}/>
                        </button>
                    </div>
                </div>

            </div>
            <div className={"mt-5 border-b-2 border-grey-500"}/>
        </>

    );
};

export default CheckoutItem;