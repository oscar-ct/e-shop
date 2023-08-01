import React, {useEffect} from 'react';
import {useParams, useNavigate, useLocation} from "react-router-dom";
import {Link} from 'react-router-dom'
import Rating from "../components/Rating";
import {useState} from "react";
// import axios from "axios";
import {useGetProductDetailsQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {addToCart} from "../slices/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {formatPrice} from "../utils/formatPriceUtilis"
import ReviewModal from "../components/ReviewModal";
import {Zoom, Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css/zoom';
import {FaTimes,} from "react-icons/fa";

const ProductPage = () => {
    // const [product, setProduct] = useState({});
    const { id: productId } = useParams();
    const { data: product, refetch, isLoading, error } = useGetProductDetailsQuery(productId);

    const {userData} = useSelector(function (state) {
        return state.auth;
    });

    const [imageIndex, setImageIndex] = useState(0);
    const [fullScreen, setFullScreen] =  useState(false);
    // useEffect(function () {
    //     const fetchProduct = async () => {
    //         const { data } = await axios.get(`/api/products/${productId}`);
    //         setProduct(data);
    //
    //     }
    //     fetchProduct();
    // }, [productId]);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const addToCartHandler = () => {
        dispatch(addToCart({
            ...product, quantity
        }));
        navigate("/cart");
    }
    useEffect(function () {
        if (location.search === "?review=true" && !window.review_modal.open) {
            window.review_modal.showModal();
        }
    }, [location.search]);


    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <Message variant={"error"} children={error?.data?.message || error.error}/>
                ) : fullScreen ? (
                    <div className={"z-10 h-max bg-black absolute top-0 right-0 left-0 bottom-0"}>
                        <div className={"relative"}>
                            <button onClick={() => setFullScreen(false)} className={"z-10 hover:text-blue-500 btn-glass btn-lg text-2xl text-base-100 absolute top-5 right-5"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-7 w-7" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                            <Swiper
                                zoom={true}
                                initialSlide={imageIndex}
                                spaceBetween={0}
                                centeredSlides={true}
                                modules={[Zoom, Navigation, Pagination]}
                                slidesPerView={1}
                                pagination={{clickable: true}}
                                navigation>
                                {product.images.map(function (data, index) {
                                    return (
                                        <SwiperSlide key={index}>
                                            <div className={"h-screen flex justify-center items-center"}>
                                                <div className={"swiper-zoom-container"}>
                                                    <img src={data.length !== 0 ? data.url : "/images/sample.jpg"} alt={"item"}/>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        </div>
                    </div>
                    ) : (
                    <div className={"lg:pt-10"}>
                        {/*<Link className={"btn btn-light my-5"} to={"/"}>*/}
                        {/*    Go Back*/}
                        {/*</Link>*/}
                        <div className={"flex flex-col bg-base-100 shadow-xl px-5 xl:px-10 pt-10 pb-10 rounded-xl mb-10"}>
                            <div className={"w-full flex flex-col lg:flex-row flex-wrap "}>
                                <div className={"flex flex-col lg:w-5/12"}>
                                    <div className={"w-full flex justify-center bg-zinc-100/60 sm:border-none rounded-sm"} onClick={() => setFullScreen(true)}>
                                        <img src={product.images.length !== 0 ? product.images[imageIndex].url : "/images/sample.jpg"} alt={"product"} className={"cursor-pointer rounded-sm lg:object-cover object-scale-down h-[28em] lg:h-[20em] xl:h-[24em] 2xl:h-[28em]"}/>
                                    </div>
                                    <div className={"w-full flex pt-7"}>
                                        {
                                            product.images.map(function (image, index) {
                                                return (
                                                    <div onMouseEnter={() => setImageIndex(index)} key={index} onClick={() => setFullScreen(true)} className={"px-1 cursor-pointer"}>
                                                        <img src={image.url} className={`rounded-sm object-cover h-16 transform transition duration-300 ${imageIndex === index ? "outline outline-offset-1 outline-blue-500 outline-1 opacity-100" : "opacity-50"}`} alt={"products"}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className={"lg:w-7/12 flex flex-col lg:flex-row lg:pl-7 py-7"}>
                                    <div className={"lg:w-7/12"}>
                                        <div className={"pb-3 border-b-[1px] border-gray-300"}>
                                            <span className={"text-2xl lg:text-xl"}>
                                                {product.name}
                                            </span>
                                            <a href={`/product/${productId}/#reviews`} className={"text-sm link link-primary"}><Rating rating={product.rating} text={`${product.numReviews} ${product.numReviews === 1 ? "review" : "reviews"}`}/>
                                            </a>
                                        </div>
                                        <div className={"py-4 border-b-[1px] text-2xl border-gray-300 flex font-bold items-start"}>
                                            {
                                                formatPrice(product.price)
                                            }
                                        </div>
                                        <div className={"text-lg lg:text-sm py-4 border-b-[1px] border-gray-300"}>
                                            <span className={"font-bold pr-2"}>
                                                Brand:
                                            </span>
                                            <span>
                                                {product.brand}
                                            </span>
                                        </div>
                                        <div className={"text-lg lg:text-sm py-4 border-b-[1px] border-gray-300"}>
                                            <span className={"font-bold pr-2"}>
                                                Model:
                                            </span>
                                            <span>
                                                {product.model}
                                            </span>
                                        </div>
                                        <div className={"text-lg lg:text-sm py-4"}>
                                            <span className={"font-bold pr-2"}>
                                                Description:
                                            </span>
                                            <span>
                                                {product.description}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={"lg:hidden border-b-[1px] border-gray-300"}/>
                                    <div className={"pt-5 lg:pt-0 lg:pl-7 lg:w-5/12 text-lg lg:text-sm"}>
                                        <div className={"flex"}>
                                            <span className={"pt-1 font-semibold text-start w-7/12"}>
                                                List Price:
                                            </span>
                                            <span className={"w-5/12 flex justify-end items-start"}>
                                                {formatPrice(product.price, "text-xl lg:text-lg")}
                                            </span>
                                        </div>
                                        <div className={"flex pt-5"}>
                                             <span className={"w-7/12 font-semibold text-start"}>
                                                In Stock:
                                            </span>
                                            <span className={"w-5/12 text-end text-md"}>
                                                {product.countInStock} left!
                                            </span>
                                        </div>
                                        <div className={"flex pt-5"}>
                                             <span className={"w-7/12 font-semibold text-start"}>
                                                Sold By:
                                            </span>
                                            <span className={"w-5/12 text-end"}>
                                                Admin
                                            </span>
                                        </div>
                                        {/*<div className={"flex justify-center"}>*/}
                                            <div className={"w-full flex flex-col justify-between pt-5"}>
                                                <div className={"flex pb-5"}>
                                                    <div className={"flex items-center justify-end w-7/12"}/>
                                                {
                                                    product.countInStock > 0 && (
                                                        <div className={"pl-2 flex justify-end items-center w-5/12"}>
                                                            <span className={"pr-1"}>Qty.</span>
                                                            <select
                                                                placeholder={"Qty 1"}
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
                                {/*<div className={"pt-5 pb-5 xl:pt-10 px-3"}>*/}
                                {/*    <h2 className={"text-2xl font-bold"}>Reviews</h2>*/}
                                {/*</div>*/}
                                <div id="reviews" className={"pt-10 xl:pt-15 flex flex-col lg:flex-row lg:justify-start"}>
                                    <div className={"w-full lg:w-7/12"}>
                                        <div className={"overflow-x-auto border-[1px] border-neutral-300 rounded-xl"}>
                                            <div className={"p-5 lg:p-8 text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]"}>
                                                <div className={`${product.reviews.length !== 0 ? "pb-6 border-b-[1px]" : "pb-0"} flex justify-between items-center  border-neutral-300`}>
                                                    {
                                                        product.reviews.length !== 0 ? (
                                                            <span className={"text-xl"}>Customer Reviews ({product.numReviews})</span>
                                                        ) : (
                                                            <h2 className={"text-xl"}>Be the first to write a review!</h2>
                                                        )
                                                    }

                                                    {
                                                        userData ? (
                                                            <button onClick={() =>  window.review_modal.showModal()} className={"p-3 rounded-lg bg-neutral/10 text-xs uppercase font-bold hover:bg-neutral/20"}>
                                                                Write a review
                                                            </button>
                                                        ) : (
                                                            <Link to={"/login"} className={"p-3 rounded-lg bg-neutral/10 text-xs uppercase font-bold hover:bg-neutral/20"}>
                                                                Write a review
                                                            </Link>
                                                        )
                                                    }
                                                </div>


                                                {
                                                    product.reviews.length !== 0 && (
                                                        product.reviews.map(function (review, index) {
                                                            return (
                                                                <div key={index} className={"pt-3"}>
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
            <ReviewModal productId={productId} refetch={refetch} onPage={true}/>
        </>
    );
};



export default ProductPage;