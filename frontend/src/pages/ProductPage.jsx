import React from 'react';
import {useParams, useNavigate} from "react-router-dom";
import {Link} from 'react-router-dom'
import Rating from "../components/Rating";
import {useState} from "react";
// import axios from "axios";
import {useGetProductDetailsQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {addToCart} from "../slices/cartSlice";
import {useDispatch} from "react-redux";

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

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const addToCartHandler = () => {
        dispatch(addToCart({
            ...product, quantity
        }));
        navigate("/cart");
    }


    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <Message variant={"error"} children={error?.data?.message || error.error}/>
                ) : (
                    <div className={"lg:pt-10"}>
                        {/*<Link className={"btn btn-light my-5"} to={"/"}>*/}
                        {/*    Go Back*/}
                        {/*</Link>*/}
                        <div className={"w-full flex flex-col lg:flex-row flex-wrap bg-base-100 shadow-xl px-10 py-5 rounded-xl"}>
                            <div className={"flex items-center lg:w-5/12"}>
                                <img src={product.image} alt={"product"} className={"rounded-xl"}/>
                            </div>
                            <div className={"lg:w-7/12 flex flex-col lg:flex-row lg:pl-7 py-7"}>
                                <div className={"lg:w-7/12"}>
                                    <div className={"pb-8 border-b-2 border-gray-300"}>
                                        <span className={"text-3xl"}>
                                            {product.name}
                                        </span>
                                    </div>
                                    <div className={"py-4 border-b-2 border-gray-300"}>
                                        <Rating rating={product.rating} text={`${product.numReviews} reviews`}/>
                                    </div>
                                    <div className={"py-4 border-b-2 border-gray-300"}>
                                        <span className={"font-bold pr-2"}>
                                            Brand:
                                        </span>
                                        <span>
                                            {product.brand}
                                        </span>
                                    </div>
                                    <div className={"py-4 border-b-2 border-gray-300"}>
                                        <span className={"font-bold pr-2"}>
                                            Model:
                                        </span>
                                        <span>
                                            {product.model}
                                        </span>
                                    </div>
                                    <div className={"py-4"}>
                                        <span className={"font-bold pr-2"}>
                                            Description:
                                        </span>
                                        <span>
                                            {product.description}
                                        </span>
                                    </div>
                                </div>
                                <div className={"lg:hidden border-b-2 border-gray-300"}/>
                                <div className={"pt-5 lg:pl-7 lg:w-5/12"}>
                                    <div className={"flex"}>
                                        <span className={"text-end w-6/12 font-bold"}>
                                            List Price:
                                        </span>
                                        <span className={"w-6/12 text-end"}>
                                            ${product.price}
                                        </span>
                                    </div>
                                    <div className={"flex pt-5"}>
                                         <span className={"w-6/12 text-end font-bold"}>
                                            Status:
                                        </span>
                                        <span className={"w-6/12 text-end"}>
                                            {product.countInStock > 0 ? `In Stock` : "Out Of Stock"}
                                        </span>
                                    </div>
                                    <div className={"flex pt-5"}>
                                         <span className={"w-6/12 text-end font-bold"}>
                                            Remaining In Stock:
                                        </span>
                                        <span className={"w-6/12 text-end"}>
                                            {product.countInStock}
                                        </span>
                                    </div>
                                    {/*<div className={"flex justify-center"}>*/}
                                        <div className={"w-full flex flex-col justify-between pt-7"}>
                                            <div className={"flex pb-5"}>
                                                <div className={"flex items-center justify-end w-6/12"}><span className={"font-bold"}>Qty:</span></div>
                                            {
                                                product.countInStock > 0 && (
                                                    <div className={"pl-2 w-6/12"}>
                                                        <select
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            value={quantity}
                                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                                        >
                                                            {
                                                                [...Array(product.countInStock).keys()].map(function (x) {
                                                                    return (
                                                                        <option key={x+1} value={x+1}>
                                                                            {x+1}
                                                                        </option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    {/*<input*/}
                                                    {/*    onChange={(e) => setQuantity(Number(e.target.value))}*/}
                                                    {/*    min={1}*/}
                                                    {/*    defaultValue={1}*/}
                                                    {/*    max={product.countInStock}*/}
                                                    {/*    type="number"*/}
                                                    {/*    className="input input-bordered w-full"/>*/}
                                                    </div>
                                                )
                                            }
                                            </div>
                                            <button className={`btn-md btn ${product.countInStock === 0 ? "btn-disabled" : "btn-primary"}`} disabled={product.countInStock === 0} onClick={addToCartHandler}>
                                                Add To Cart
                                            </button>
                                        </div>
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        </>
    );
};

export default ProductPage;