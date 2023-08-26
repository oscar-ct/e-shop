import {Link} from "react-router-dom";
import {formatPrice} from "../utils/formatPriceUtilis";


const OrderItem = ( {item, canceledItems, isCanceled, paidAt} ) => {

    // const strikethrough = () => canceledItems.includes(item.productId) && "line-through opacity-70";
    const strikethrough = function () {
        if (canceledItems.some(e => e.productId === item.productId) || isCanceled) {
            return "line-through";
        }
    };

    // ${(canceledItems.some(e => e.productId === item.productId && e.canceledAt > paidAt)) && "bg-green-300/20 rounded-md"}

    return (
        <>
            <div className={`flex w-full mt-5 ${(canceledItems.some(e => e.productId === item.productId) || isCanceled) && "opacity-70"}`}
            >
                <div className={"w-2/12"}>
                    <Link className={"rounded-md bg-zinc-100/70 w-full h-full flex justify-center items-center"} to={`/product/${item.productId}`}>
                        <img className={"max-h-[160px] object-scale-down rounded-md"} src={item.images.length !== 0 ? item.images[0].url : "/images/sample.jpg"} alt={"cartItem"}/>
                    </Link>
                </div>

                <div className={"w-8/12 flex flex-col px-3 sm:px-5"}>

                    <Link to={`/product/${item.productId}`} className={`sm:text-lg font-bold hover:link-primary ${strikethrough()}`}>
                        {item.name}
                    </Link>

                    <div className={"flex w-full justify-between items-end"}>
                        <div className={"flex flex-col"}>
                            <div>
                                <span className={`text-gray-500 font-bold text-xs`}>
                                    Qty:
                                </span>
                                <span className={`ml-1 text-sm ${strikethrough()}`}>
                                    {item.quantity}
                                </span>
                            </div>
                            <div>
                                <span className={"text-gray-500 font-bold text-xs"}>
                                    Price:
                                </span>
                                <span className={`ml-1 text-sm ${strikethrough()}`}>
                                    ${item.price}/ea.
                                </span>
                            </div>
                        </div>
                    </div>



                </div>

                <div className={"w-2/12 flex flex-col items-end justify-between"}>
                    <div className={strikethrough()}>
                    {
                        formatPrice(item.price * item.quantity, "text-xl")
                    }
                    </div>
                </div>

            </div>

            {
                (canceledItems.some(e => e.productId === item.productId) || isCanceled) && (
                    <h3 className={"text-end text-xs font-semibold text-red-500"}>
                        <span>Canceled on </span>
                        {
                            canceledItems.map(function (x) {
                                if (x.productId === item.productId) {
                                    return x.canceledAt;
                                } else {
                                    return ""
                                }
                            })
                        }
                    </h3>
                )
            }

            <div className={"mt-5 border-b-[1px] border-gray-300"}/>
        </>

    );
};

export default OrderItem;