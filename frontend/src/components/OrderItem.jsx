import {Link} from "react-router-dom";

const OrderItem = ( {item} ) => {


    return (
        <>
            <div className={"flex w-full mt-5"}>

                <div className={"w-2/12"}>
                    <Link to={`/product/${item._id}`}>
                        <img className={"lg:w-32 rounded-xl"} src={item.image} alt={"cartItem"}/>
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
                                    Quantity:
                                </span>
                                <span className={"ml-1 text-sm"}>
                                    {item.quantity}
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

                    </div>
                </div>

                <div className={"w-2/12 flex flex-col items-end justify-between"}>
                    <span className={"text-lg font-bold"}>
                        ${(item.price * item.quantity).toFixed(2)}
                    </span>
                </div>

            </div>
            <div className={"mt-5 border-b-2 border-grey-500"}/>
        </>

    );
};

export default OrderItem;