import React from 'react';
import {useParams} from "react-router-dom";
import {Link} from 'react-router-dom'
import Rating from "../components/Rating";
// import {useEffect, useState} from "react";
// import axios from "axios";
import {useGetProductDetailsQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";

const ProductPage = () => {
    // const [product, setProduct] = useState({});

    const { id: productId } = useParams();
    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
    // useEffect(function () {
    //     const fetchProduct = async () => {
    //         const { data } = await axios.get(`/api/products/${productId}`);
    //         setProduct(data);
    //
    //     }
    //     fetchProduct();
    // }, [productId]);


    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <Message variant={"error"} children={error?.data?.message || error.error}/>
                ) : (
                    <>
                        <Link className={"btn btn-light my-5"} to={"/"}>
                            Go Back
                        </Link>
                        <div className={"w-full flex flex-col lg:flex-row flex-wrap pb-5"}>
                            <div className={"flex justify-center lg:w-5/12"}>
                                <img src={product.image} alt={"product"}/>
                            </div>
                            <div className={"lg:w-4/12 p-7"}>
                                <div className={"pb-8 border-b-2 border-gray-300"}>
                                    <span className={"text-3xl"}>{product.name}</span>
                                </div>
                                <div className={"py-4 border-b-2 border-gray-300"}>
                                    <Rating rating={product.rating} text={`${product.numReviews} reviews`}/>
                                </div>
                                <div className={"py-4 border-b-2 border-gray-300"}>
                                    <span>Brand: {product.brand}</span>
                                </div>
                                <div className={"pt-4"}>
                                    <span>{product.description}</span>
                                </div>
                            </div>
                            <div className={"lg:w-3/12"}>
                                <div className={"px-6 text-xl lg:text-base"}>
                                    <div className={"rounded-tr-lg rounded-tl-lg border-2 border-gray-300 p-6 w-full flex"}>
                                <span className={"w-6/12"}>
                                    Price:
                                </span>
                                        <span className={"w-6/12 font-bold"}>
                                    ${product.price}
                                </span>
                                    </div>
                                </div>
                                <div className={"px-6 text-xl lg:text-base"}>
                                    <div className={"border-x-2 border-b-2 border-gray-300 p-6 w-full flex"}>
                                 <span className={"w-6/12"}>
                                    Status:
                                </span>
                                        <span className={"w-6/12 font-bold"}>
                                    {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                                </span>
                                    </div>
                                </div>
                                <div className={"px-6"}>
                                    <div className={"rounded-br-lg rounded-bl-lg border-x-2 border-b-2 border-gray-300 p-6 w-full flex justify-center"}>
                                        <button className={`lg:btn-md btn-lg btn ${product.countInStock === 0 ? "btn-disabled" : "btn-light"}`} disabled={product.countInStock === 0}>
                                            Add To Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

        </>
    );
};

export default ProductPage;