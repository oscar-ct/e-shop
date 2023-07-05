import React from 'react';
import {Link} from 'react-router-dom'
import Rating from "./Rating";

const Product = ( {product} ) => {
    return (
        <>
            <div className="w-6/12 sm:w-72 p-2 sm:p-3">
                <div className={"card bg-base-100 shadow-xl"}>
                    <Link to={`/product/${product._id}`}>
                        <figure className="">
                            <img src={product.image} alt="product" className="rounded-tr-xl rounded-tl-xl" />
                        </figure>
                    </Link>
                    <div className="card-body p-2 sm:p-4 items-center ">
                        <div className={"w-full"}>
                            <h2 className="text-sm truncate sm:text-lg font-bold">{product.name}</h2>
                        </div>

                        {/*<p>{product.description}</p>*/}
                        <div className={"w-full flex flex-col"}>
                            <div className={"hidden sm:flex justify-start"}>
                                <Rating rating={product.rating} text={`${product.numReviews} reviews`}/>
                            </div>
                            <div className={"flex sm:pt-2 justify-end"}>
                                <span className={"sm:text-xl font-bold text-slate-500"}>${product.price}</span>
                            </div>
                        </div>
                        {/*<div className="card-actions">*/}
                        {/*    <button className="btn btn-primary">Buy Now</button>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;