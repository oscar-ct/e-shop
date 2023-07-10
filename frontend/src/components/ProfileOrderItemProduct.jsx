import React from 'react';


const ProfileOrderItemProduct = ({product, index, orderSize}) => {

    return (
        <>
            <div className={"pt-5 px-5"}>
                <div className={"flex flex-col lg:flex-row"}>
                    <div className={"w-full lg:w-8/12"}>
                        <div className={"flex bg-base-100 pb-3"}>
                            <div className="avatar pr-5">
                                <div className="rounded-xl w-24 h-24">
                                    <img src={product.image}  alt={"product"}/>
                                </div>
                            </div>
                            <div className={"flex flex-col"}>
                                <span className={"font-bold"}>
                                    {product.name}
                                </span>
                                <span className={"text-xs"}>
                                    ${product.price} / ea.
                                </span>
                                <div className={"pt-3"}>
                                    <button className={"btn btn-warning w-36"}>
                                        Buy it again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"w-full lg:w-4/12"}>
                        <div className={"flex flex-col items-center bg-base-500 p-5"}>
                            <div className={"p-2 w-full"}>
                                <button className={"btn text-xs btn-sm w-full"}>
                                    Return or replace
                                </button>
                            </div>
                            <div className={"p-2 w-full "}>
                                <button className={"btn text-xs btn-sm w-full"}>
                                    Write a product review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                index+1 !== orderSize && (
                    <div className={"border-b-2 border-grey-500 mx-5"}/>
                )
            }

        </>
    );
};

export default ProfileOrderItemProduct;