import {Link} from "react-router-dom";
import {FaTrash} from "react-icons/fa";
import {addToCart, removeFromCart} from "../slices/cartSlice";
import {useDispatch} from "react-redux";
import FormatPrice from "./FormatPrice";

const CartItem = ( {item} ) => {

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
            <div className={"flex w-full"}>
                <div className={"w-3/12"}>
                    <Link className={"bg-zinc-100/70 rounded-md w-full h-full flex justify-center items-center"} to={`/product/${item._id}`}>
                        <img className={"max-h-[160px] object-cover rounded-md"} src={item.images.length !== 0 ? item.images[0].url : "/images/sample.jpg"} alt={"cartItem"}/>
                    </Link>
                </div>

                <div className={"w-7/12"}>
                    <div className={"flex flex-col px-5"}>
                        <Link to={`/product/${item._id}`} className={"lg:text-lg font-bold hover:link hover:link-primary"}>
                            {item.name}
                        </Link>

                        <div className={"flex flex-col lg:pt-3"}>
                            <div className={"flex flex-col text-xs sm:text-sm"}>
                                <div className={"pb-1"}>
                                    <span className={"text-xs font-bold text-gray-500"}>Brand:</span>
                                    <span className={"ml-1"}>{item.brand}</span>
                                </div>
                                <div className={"pb-1"}>
                                    <span className={"text-xs font-bold text-gray-500"}>Model:</span>
                                    <span className={"ml-1 "}>{item.model}</span>
                                </div>
                            </div>
                            <div className={"flex flex-col text-xs sm:text-sm"}>
                                <div className={"flex items-center pb-1"}>
                                     <span className={"text-xs font-bold text-gray-500"}>Remaining In Stock:</span>
                                    <span className={"ml-1"}>{item.countInStock}</span>
                                </div>
                                <div>
                                    <span className={"text-xs font-bold text-gray-500"}>List Price:</span>
                                    <span className={"ml-1"}>${item.price}/ea.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"w-2/12 flex flex-col items-end justify-between"}>
                    <FormatPrice price={item.price * item.quantity} fontSize={"text-xl"}/>
                    <div className={"py-2 flex justify-end items-center flex-col lg:flex-row"}>
                        <label className="block lg:mr-2 text-sm font-medium text-gray-900 dark:text-white pb-2">
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
                    <div>
                        <button
                            onClick={() => removeFromCartHandler(item._id)}
                            className={"btn-glass btn-xs rounded-full"}
                        >
                            <FaTrash className={"text-sm text-red-500"}/>
                        </button>
                    </div>
                </div>
            </div>
            <div className={"my-5 border-b-[1px] border-gray-300"}/>
        </>
    );
};

export default CartItem;