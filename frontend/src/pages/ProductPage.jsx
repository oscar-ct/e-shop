import React from 'react';
import {useParams, useNavigate} from "react-router-dom";
import {Link} from 'react-router-dom'
import Rating from "../components/Rating";
import {useState} from "react";
// import axios from "axios";
import {useGetProductDetailsQuery, useCreateReviewMutation} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {addToCart} from "../slices/cartSlice";
import {useDispatch, useSelector} from "react-redux";

const ProductPage = () => {
    // const [product, setProduct] = useState({});

    const { id: productId } = useParams();
    const { data: product, refetch, isLoading, error } = useGetProductDetailsQuery(productId);
    const [createReview] = useCreateReviewMutation();
    const {userData} = useSelector(function (state) {
        return state.auth;
    });
    const [rating, setRating] = useState("0");
    const [title, setTitle] = useState("");
    const [reviewBody, setReviewBody] = useState("");
    const [errorReviewMessage, setErrorReviewMessage] = useState("")

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
    const closeEditModal = (e) => {
        e.preventDefault();
        window.review_modal.close();
    }
    const submitReview = async (e) => {
        e.preventDefault();
        if (rating === "0") {
            setErrorReviewMessage("Please select a rating");
            return
        }
        if (!reviewBody || !title) {
            setErrorReviewMessage("Please fill out all text fields");
            return
        }
        const data = {
            productId,
            rating,
            title,
            comment: reviewBody,
        }
        try {
            await createReview(data).unwrap();
            refetch();
        } catch (e) {
            // toast error message for later
            console.log(e)
        }
        setErrorReviewMessage("");
        setReviewBody("");
        setRating("0");
        setTitle("");
        window.review_modal.close();
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
                        <div className={"flex flex-col bg-base-100 shadow-xl px-5 xl:px-10 pt-5 pb-10 rounded-xl mb-10"}>
                            <div className={"w-full flex flex-col lg:flex-row flex-wrap "}>
                                <div className={"flex items-center lg:w-5/12"}>
                                    <img src={product.image} alt={"product"} className={"rounded-xl"}/>
                                </div>
                                <div className={"lg:w-7/12 flex flex-col lg:flex-row lg:pl-7 py-7"}>
                                    <div className={"lg:w-7/12"}>
                                        <div className={"pb-3 border-b-[1px] border-gray-300"}>
                                            <span className={"text-xl"}>
                                                {product.name}
                                            </span>
                                            <span className={"text-sm link-primary"}><Rating rating={product.rating} text={`${product.numReviews} ${product.numReviews > 1 ? "reviews" : "review"}`}/></span>
                                        </div>
                                        <div className={"py-4 border-b-[1px] text-2xl border-gray-300 flex font-bold items-start"}>
                                            <span className={"text-xs pt-1"}>$</span>

                                            <span>{product.price.toString().substring(0,  product.price.toString().indexOf("."))}</span>
                                            <span className={"text-xs pt-1"}>{product.price.toString().substring( product.price.toString().indexOf(".")+1, product.price.toString().length)}</span>
                                        </div>
                                        <div className={"text-sm py-4 border-b-[1px] border-gray-300"}>
                                            <span className={"font-bold pr-2"}>
                                                Brand:
                                            </span>
                                            <span>
                                                {product.brand}
                                            </span>
                                        </div>
                                        <div className={"text-sm py-4 border-b-[1px] border-gray-300"}>
                                            <span className={"font-bold pr-2"}>
                                                Model:
                                            </span>
                                            <span>
                                                {product.model}
                                            </span>
                                        </div>
                                        <div className={"text-sm py-4"}>
                                            <span className={"font-bold pr-2"}>
                                                Description:
                                            </span>
                                            <span>
                                                {product.description}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={"lg:hidden border-b-[1px] border-gray-300"}/>
                                    <div className={"pt-5 lg:pl-7 lg:w-5/12 text-sm"}>
                                        <div className={"flex"}>
                                            <span className={"text-end w-8/12 font-bold"}>
                                                List Price:
                                            </span>
                                            <span className={"w-4/12 text-end"}>
                                                ${product.price}
                                            </span>
                                        </div>
                                        <div className={"flex pt-5"}>
                                             <span className={"w-8/12 text-end font-bold"}>
                                                Remaining In Stock:
                                            </span>
                                            <span className={"w-4/12 text-end"}>
                                                {product.countInStock}
                                            </span>
                                        </div>
                                        {/*<div className={"flex justify-center"}>*/}
                                            <div className={"w-full flex flex-col justify-between pt-5"}>
                                                <div className={"flex pb-5"}>
                                                    <div className={"flex items-center justify-end w-7/12"}><span className={"font-bold"}>Qty:</span></div>
                                                {
                                                    product.countInStock > 0 && (
                                                        <div className={"pl-2 w-5/12"}>
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
                            <div>
                                <div className={"pt-5 pb-5 xl:pt-10 px-3"}>
                                    <h2 className={"text-2xl font-bold"}>Reviews</h2>
                                </div>
                                <div className={"flex flex-col lg:flex-row"}>
                                    <div className={"w-full lg:pr-1 lg:w-6/12"}>
                                        <div className={"overflow-x-auto border-[1px] border-neutral-300 rounded-xl pb-10"}>
                                            <div className={"px-4 lg:px-10 pt-5"}>
                                                <div className={"pt-2 pb-6 flex justify-between items-center border-b-[1px] border-neutral-300"}>
                                                    {
                                                        product.reviews.length !== 0 ? (
                                                            <span className={"text-xl"}>Recent Reviews</span>
                                                        ) : (
                                                            <h2 className={"text-xl"}>Be the first to write a review!</h2>
                                                        )
                                                    }

                                                    {
                                                        userData ? (
                                                            <button onClick={() =>  window.review_modal.showModal()} className={"text-xs link link-primary"}>
                                                                Write a review
                                                            </button>
                                                        ) : (
                                                            <Link to={"/login"} className={"text-xs link link-primary"}>
                                                                Write a review
                                                            </Link>
                                                        )
                                                    }
                                                </div>


                                                {
                                                    product.reviews.length !== 0 && (
                                                        product.reviews.map(function (review, index) {
                                                            return (
                                                                <div key={index} className={"py-3"}>
                                                                    <div className={"flex flex-col"}>
                                                                        <div className={"flex justify-between"}>
                                                                    <span className={"pb-2 text-xs font-bold text-neutral-500"}>
                                                                        {review.name}
                                                                    </span>
                                                                            <span className={"pb-2 text-xs font-bold text-neutral-500"}>
                                                                        {review.createdAt.substring(0, 10)}
                                                                    </span>
                                                                        </div>

                                                                        <div className={"flex items-start"}>
                                                                            <div className={"pt-[2px]"}>
                                                                                <Rating rating={review.rating}/>
                                                                            </div>

                                                                            <span className={"pl-2 text-sm font-bold"}>
                                                                                {review.title}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <p className={"pt-2 text-sm"}>
                                                                        {review.comment}
                                                                    </p>
                                                                </div>
                                                            )
                                                        })

                                                    )
                                                }




                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
                <form method="dialog" className="modal-box">
                    <div className={"flex justify-between items-center"}>
                        <h3 className="p-4 font-bold text-xl">Create review</h3>
                        <div className="rating rating-lg">
                            <input type="radio" value={"0"} name="rating" className="rating-hidden" onChange={(e) => setRating(e.target.value)} checked={rating === "0"}/>
                            <input type="radio" onChange={(e) => setRating(e.target.value)} value={"1"} name="rating" className="mask mask-star-2 bg-orange-300" />
                            <input type="radio" onChange={(e) => setRating(e.target.value)} value={"2"} name="rating" className="mask mask-star-2 bg-orange-300"/>
                            <input type="radio" onChange={(e) => setRating(e.target.value)} value={"3"} name="rating" className="mask mask-star-2 bg-orange-300" />
                            <input type="radio" onChange={(e) => setRating(e.target.value)} value={"4"} name="rating" className="mask mask-star-2 bg-orange-300" />
                            <input type="radio" onChange={(e) => setRating(e.target.value)} value={"5"} name="rating" className="mask mask-star-2 bg-orange-300" />
                        </div>
                    </div>

                    <div className="px-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Add a headline</span>
                            </label>
                            <input type="text" placeholder="What's most important to know?" className="input input-bordered w-full" value={title} onChange={(e) => {
                                setTitle(e.target.value);
                            }}/>
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Add a review</span>
                            </label>
                            <textarea value={reviewBody} placeholder="What did you like or dislike? What did you use this product for?" className="h-20 pt-2 input input-bordered w-full" onChange={(e) => {
                                setReviewBody(e.target.value);
                            }}/>
                        </div>
                        {
                            errorReviewMessage && (
                                <h2 className={"pt-2 text-center text-red-600 font-bold"}>
                                    {errorReviewMessage}
                                </h2>
                            )

                        }

                    </div>
                    <div className="modal-action">
                        <button onClick={closeEditModal} className={"btn btn-error"}>Cancel</button>
                        <button
                            onClick={submitReview}
                            className="btn btn-primary"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </dialog>
        </>
    );
};



export default ProductPage;