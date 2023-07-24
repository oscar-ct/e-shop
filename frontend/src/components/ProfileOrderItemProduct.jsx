import React from 'react';


const ProfileOrderItemProduct = ({product, index, orderSize}) => {

    return (
        <>
            <div className={"py-5 px-5"}>
                <div className={"flex flex-col lg:flex-row"}>
                    <div className={"w-full"}>
                        <div className={"flex bg-base-100 pb-3"}>
                            <div className="avatar pr-5">
                                <div className="rounded-xl w-24 h-24">
                                    <img src={product.images.length !== 0 ? product.images[0].url : "/images/sample.jpg"}  alt={"product"}/>
                                </div>
                            </div>
                            <div className={"flex flex-col"}>
                                <span className={"font-bold"}>
                                    {product.name}
                                </span>
                                <div className={"flex"}>
                                    <span className={"text-xs"}>
                                        ${product.price}/ea
                                    </span>
                                    <span className={"pl-10 text-xs"}>
                                        Qty: {product.quantity}
                                    </span>
                                </div>
                                <div className={"pt-3"}>
                                    <button className={"btn btn-warning w-36"}>
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