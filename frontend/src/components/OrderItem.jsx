import {Link} from "react-router-dom";
import {formatPrice} from "../utils/formatPriceUtilis";


const OrderItem = ( {item} ) => {


    return (
        <>
            <div className={"flex w-full mt-5"}>

                <div className={"w-2/12"}>
                    <Link to={`/product/${item.product}`}>
                        <img className={"lg:w-32 rounded-xl"} src={item.images.length !== 0 ? item.images[0].url : "/images/sample.jpg"} alt={"cartItem"}/>
                    </Link>
                </div>

                <div className={"w-8/12 flex flex-col px-3 sm:px-5"}>

                    <Link to={`/product/${item.product}`} className={"sm:text-lg font-bold text-neutral hover:link hover:link-primary"}>
                        {item.name}
                    </Link>

                    <div className={"flex w-full justify-between items-end"}>
                        <div className={"flex flex-col"}>
                            <div>
                                <span className={"text-gray-500 font-bold text-xs"}>
                                    Qty:
                                </span>
                                <span className={"ml-1 text-sm"}>
                                    {item.quantity}
                                </span>
                            </div>
                            <div>
                                <span className={"text-gray-500 font-bold text-xs"}>
                                    Price:
                                </span>
                                <span className={"ml-1 text-sm"}>
                                    ${item.price}/ea.
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className={"w-2/12 flex flex-col items-end justify-between"}>
                    {
                        formatPrice(item.price * item.quantity, "text-xl")
                    }
                </div>

            </div>
            <div className={"mt-5 border-b-2 border-grey-500"}/>
        </>

    );
};

export default OrderItem;