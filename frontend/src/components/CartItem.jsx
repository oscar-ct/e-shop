import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {FaTrash} from "react-icons/fa";
import {addToCart, removeFromCart} from "../slices/cartSlice";
import {useDispatch} from "react-redux";

const CartItem = ( {item} ) => {

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
            <div className={"my-6 border-b-2 border-grey-500"}/>
            <div className={"flex w-full"}>

                <div className={"w-3/12"}>
                    <Link to={`/product/${item._id}`}>
                        <img className={"lg:w-56 rounded-sm"} src={item.image} alt={"cartItem"}/>
                    </Link>
                </div>

                <div className={"w-8/12 flex flex-col px-5"}>

                    <div className={"card-title"}>
                        {item.name}
                    </div>

                    <div className={"flex flex-col pt-2 text-sm"}>
                        <div>
                            <span className={"font-bold"}>
                                Brand:
                            </span>
                            <span className={"ml-1"}>
                                {item.brand}
                            </span>
                        </div>
                        <div className={"py-1"}>
                            <span className={"font-bold"}>
                                Remaining In Stock:
                            </span>
                            <span className={"ml-1"}>
                                {item.countInStock}
                            </span>
                        </div>
                        <div>
                            <span className={"font-bold"}>
                                Price:
                            </span>
                            <span className={"ml-1"}>
                                ${item.price}
                            </span>
                        </div>
                    </div>

                    <div className={"h-full flex items-end"}>
                        <div className={"flex"}>
                            <div>
                                <span className={"font-bold"}>
                                    Qty:
                                </span>
                                <input
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    min={1}
                                    defaultValue={item.quantity}
                                    max={item.countInStock}
                                    type="number"
                                    className="mx-2 input input-bordered max-w-xs"
                                />
                            </div>
                            <div className={"w-20 flex justify-center items-center"}>
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
                    <span className={"text-xl font-bold"}>
                        ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <div>
                        <button
                            onClick={() => removeFromCartHandler(item._id)}
                            className={"btn btn-sm"}
                        >
                            <FaTrash className={"text-lg"}/>
                        </button>
                    </div>
                </div>

            </div>
        </>

    );
};

export default CartItem;