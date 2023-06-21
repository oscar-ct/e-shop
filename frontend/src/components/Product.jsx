import React from 'react';
import {Link} from 'react-router-dom'
import Rating from "./Rating";

const Product = ( {product} ) => {
    return (
        <>
            <div className="card w-96 bg-base-100 shadow-xl m-3">
                <Link to={`/product/${product._id}`}>
                    <figure className="px-10 pt-10">
                        <img src={product.image} alt="Shoes" className="rounded-xl" />
                    </figure>
                </Link>
                <div className="card-body items-center text-center">
                    <div className={"w-full h-16"}>
                        <h2 className="card-title">{product.name}</h2>
                    </div>

                    {/*<p>{product.description}</p>*/}
                    <div className={"w-full flex flex-col"}>
                        <div className={"flex justify-start"}>
                            <Rating rating={product.rating} text={`${product.numReviews} reviews`}/>
                        </div>
                        <div className={"flex justify-start"}>
                            <span className={"text-2xl font-bold text-slate-500"}>${product.price}</span>
                        </div>
                    </div>

                    <div className="card-actions">
                        <button className="btn btn-primary">Buy Now</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;