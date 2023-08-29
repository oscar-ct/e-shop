import React, {useEffect, useRef} from 'react';
import {useParams, useLocation} from "react-router-dom";
import {Link} from 'react-router-dom'
import Rating from "../components/Rating";
import {useState} from "react";
// import axios from "axios";
import {useGetProductDetailsQuery, useGetProductsByRatingQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {addToCart} from "../slices/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {formatPrice} from "../utils/formatPriceUtilis"
import ReviewModal from "../components/ReviewModal";
import {Zoom, Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css/zoom';
import {toast} from "react-hot-toast";
import BackButton from "../components/BackButton";
import Meta from "../components/Meta";
import ProductItem from "../components/ProductItem";
import {motion} from "framer-motion";


const ProductPage = () => {
    // const [product, setProduct] = useState({});
    const { id: productId } = useParams();
    const { data: product, refetch, isLoading, error } = useGetProductDetailsQuery(productId);
    const { data: topRatedProducts, isLoading: loadingRated, error: errorRated } = useGetProductsByRatingQuery();

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
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const addToCartHandler = () => {
        dispatch(addToCart({
            ...product, quantity
        }));
        toast.success("Added To Cart")
        // navigate("/cart");
    }
    useEffect(function () {
        if (location.search === "?review=true" && !window.review_modal.open) {
            window.review_modal.showModal();
        }
    }, [location.search]);

    const scrollTo = useRef(null);

    const executeScroll = (ref) => {
        scrollTo.current.scrollIntoView({behavior: "smooth", block: "start"})
    };

    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error || errorRated ? (
                    <div className={"pt-10 px-2"}>
                        <BackButton/>
                        <Message variant={"error"} children={error?.data?.message || error.error}/>
                    </div>
                ) : !isLoading && fullScreen ? (
                    <div className={"z-10 h-max bg-black absolute top-0 right-0 left-0 bottom-0"}>
                        <div className={"relative"}>
                            <button onClick={() => setFullScreen(false)} className={"z-10 hover:text-blue-500 btn-glass btn-lg text-2xl text-white absolute top-5 right-5"}>
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
                    ) : !isLoading && (
                    <>
                        <Meta title={product.name}/>
                        <BackButton/>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={"pb-10 flex flex-col"}
                        >
                            <div className={"flex flex-col lg:flex-row"}>
                                <div className={"lg:w-9/12 flex flex-col lg:pr-3"}>
                                    <div className={"sm:hidden px-3 py-3 border-b-[1px] border-gray-300 flex flex-col"}>
                                        <span className={"text-2xl lg:text-xl font-semibold"}>
                                            {product.name}
                                        </span>
                                        <div className={"flex"}>
                                            <button onClick={executeScroll} className={"text-sm link link-primary"}><Rating rating={product.rating} text={`${product.numReviews} ${product.numReviews === 1 ? "review" : "reviews"}`}/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className={"w-full flex flex-col lg:flex-row flex-wrap bg-white shadow-xl rounded-xl px-5 xl:px-7 pt-3 md:pt-10 sm:pb-10"}>
                                        <div className={"flex flex-col lg:w-6/12"}>
                                            <div className={"w-full flex justify-center rounded-xl bg-zinc-100/20 sm:border-none rounded-sm"} onClick={() => setFullScreen(true)}>
                                                <img src={product.images.length !== 0 ? product.images[imageIndex].url : "/images/sample.jpg"} alt={"product"} className={"rounded-xl cursor-pointer rounded-sm object-scale-down h-[28em] lg:h-[20em] xl:h-[24em] 2xl:h-[28em]"}/>
                                            </div>
                                            <div className={"w-full flex pt-7"}>
                                                {
                                                    product.images.map(function (image, index) {
                                                        return (
                                                            <div onMouseEnter={() => setImageIndex(index)} key={index} onDoubleClick={() => setFullScreen(true)} className={"px-1 cursor-pointer"}>
                                                                <img src={image.url} className={`rounded-sm object-cover h-16 transform transition duration-300 ${imageIndex === index ? "outline outline-offset-1 outline-blue-500 outline-1 opacity-100" : "opacity-50"}`} alt={"products"}/>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className={"lg:w-6/12 flex flex-col lg:flex-row lg:pl-7 py-7 lg:pt-0"}>
                                            <div className={"w-full h-min border-b-[1px] border-gray-300"}>
                                                <div className={"hidden sm:block pb-3 border-b-[1px] border-gray-300"}>
                                                    <span className={"text-2xl lg:text-xl font-semibold"}>
                                                        {product.name}
                                                    </span>
                                                    <button onClick={executeScroll} className={"block text-sm link link-primary"}><Rating rating={product.rating} text={`${product.numReviews} ${product.numReviews === 1 ? "review" : "reviews"}`}/>
                                                    </button>
                                                </div>
                                                <div className={"pb-4 sm:pt-4 border-b-[1px] sm:text-3xl text-4xl border-gray-300 flex items-start"}>
                                                    {
                                                        formatPrice(product.price)
                                                    }
                                                </div>
                                                <div>
                                                    <h6 className={"text-lg lg:text-sm text-center pt-5 pb-5 font-semibold lg:pb-2"}>Product Details</h6>
                                                </div>
                                                <div className={"text-lg lg:text-sm py-1"}>
                                                    <span className={"font-semibold pr-3"}>
                                                        Brand:
                                                    </span>
                                                    <span className={"font-normal"}>
                                                        {product.brand}
                                                    </span>
                                                </div>
                                                <div className={"text-lg lg:text-sm py-1"}>
                                                    <span className={"font-semibold pr-2"}>
                                                        Model:
                                                    </span>
                                                    <span className={"font-normal"}>
                                                        {product.model}
                                                    </span>
                                                </div>
                                                <div className={"text-lg lg:text-sm py-1"}>
                                                    <span className={"font-semibold pr-3"}>
                                                        Color:
                                                    </span>
                                                    <span className={"font-normal"}>
                                                        {product.color}
                                                    </span>
                                                </div>
                                                <div className={"text-lg lg:text-sm pt-1 pb-5"}>
                                                    <span className={"font-semibold pr-3"}>
                                                        Description:
                                                    </span>
                                                    <span className={"font-normal"}>
                                                        {product.description}
                                                    </span>
                                                </div>
                                            </div>
                                            {/*<div className={"lg:hidden border-b-[1px] border-gray-300"}/>*/}
                                        </div>
                                    </div>

                                </div>

                                <div className={"pt-10 lg:pt-0 lg:w-3/12 lg:pl-3"}>
                                    <div
                                        className={"rounded-xl h-full p-7 text-lg lg:text-sm bg-white shadow-xl border-[1px] border-gray-300 mx-6 sm:mx-0 sm:border-none"}
                                        // style={{background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(222,228,253,1) 175%)"}}
                                    >
                                        <div className={"py-2 sm:hidden"}>Buy Now</div>
                                        <div className={"flex py-2"}>
                                            <span className={"w-full flex justify-start items-start"}>
                                                {formatPrice(product.price, "text-2xl")}
                                            </span>
                                        </div>
                                        {
                                            product.price > 100 && (
                                                <div className={"flex py-2"}>
                                                    <span><span className={"pr-1 text-lg font-semibold text-green-400"}>FREE</span>3-day shipping </span>
                                                </div>
                                            )
                                        }
                                        <div className={"flex py-2"}>
                                            {
                                                product.countInStock > 0 ? (
                                                    <span className={"font-semibold"}>
                                                        Only {product.countInStock} left in stock - order soon
                                                    </span>
                                                ) : (
                                                    <span className={"text-red-600 w-full font-semibold flex justify-start"}>
                                                        Out of stock
                                                    </span>
                                                )
                                            }
                                        </div>
                                        <div className={"flex py-3 text-sm text-gray-500"}>
                                            <span className={"w-4/12  font-semibold text-start"}>Sold By:</span>
                                            <span className={"w-8/12 text-start"}>Admin</span>
                                        </div>
                                        <div className={"w-full flex flex-col justify-between pt-3"} >
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
                                            <button className={`rounded-xl btn-md btn ${product.countInStock === 0 ? "btn-disabled" : "btn-primary shadow-blue"}`} disabled={product.countInStock === 0} onClick={addToCartHandler}>
                                                Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div ref={scrollTo} className={"w-full"}>
                                <div id="reviews" className={"pt-6 xl:pt-15 flex flex-col lg:flex-row lg:justify-start h-[27em]"}>
                                    <div className={"w-full lg:w-6/12 lg:pr-3"}>
                                        <div className={"h-full bg-white shadow-xl rounded-xl overflow-x-auto"}>
                                            <div className={"p-5 lg:p-8 h-full"}>
                                                <div className={`${product.reviews.length !== 0 ? "pb-6 border-b-[1px] border-gray-300" : "pb-0"} flex justify-between items-center`}>
                                                    {
                                                        product.reviews.length !== 0 ? (
                                                            <span className={"text-xl font-semibold"}>Customer Reviews ({product.numReviews})</span>
                                                        ) : (
                                                            <h2 className={"font-semibold text-xl"}>Be the first to write a review!</h2>
                                                        )
                                                    }

                                                    {
                                                        userData ? (
                                                            <button onClick={() =>  window.review_modal.showModal()} className={"p-3 rounded-lg bg-neutral/10 text-xs uppercase hover:bg-neutral/20 text-center"}>
                                                                Write a review
                                                            </button>
                                                        ) : (
                                                            <Link to={"/login"} className={"p-3 rounded-lg bg-neutral/10 text-xs uppercase hover:bg-neutral/20 text-center"}>
                                                                Write a review
                                                            </Link>
                                                        )
                                                    }
                                                </div>
                                                {
                                                    product.reviews.length === 0 && (
                                                        <div className={"w-full px-4 pt-10 flex flex-col gap-6 justify-center items-center"}>
                                                            <div className={"flex items-center"}>
                                                                <div className="rating rating-sm pr-5">
                                                                    <input disabled type="radio" name="rating-5" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-5" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-5" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-5" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled checked type="radio" name="rating-5" className="mask mask-star-2 bg-warning" />
                                                                </div>
                                                                <progress className="progress progress-warning w-[15em] sm:w-[25em] lg:w-[20em] 2xl:w-[25em]" value={0} max="100"/>
                                                            </div>
                                                            <div className={"flex items-center"}>
                                                                <div className="rating rating-sm pr-5">
                                                                    <input disabled type="radio" name="rating-4" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-4" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-4" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled checked type="radio" name="rating-4" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-4" className="mask mask-star-2 bg-warning" />
                                                                </div>
                                                                <progress className="progress progress-warning w-[15em] sm:w-[25em] lg:w-[20em] 2xl:w-[25em]" value={0} max="100"/>
                                                            </div>
                                                            <div className={"flex items-center"}>
                                                                <div className="rating rating-sm pr-5">
                                                                    <input disabled type="radio" name="rating-3" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-3" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled checked type="radio" name="rating-3" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-3" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-3" className="mask mask-star-2 bg-warning" />
                                                                </div>
                                                                <progress className="progress progress-warning w-[15em] sm:w-[25em] lg:w-[20em] 2xl:w-[25em]" value={0} max="100"/>
                                                            </div>
                                                            <div className={"flex items-center"}>
                                                                <div className="rating rating-sm pr-5">
                                                                    <input disabled type="radio" name="rating-2" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled checked type="radio" name="rating-2" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-2" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-2" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-2" className="mask mask-star-2 bg-warning" />
                                                                </div>
                                                                <progress className="progress progress-warning w-[15em] sm:w-[25em] lg:w-[20em] 2xl:w-[25em]" value={0} max="100"/>
                                                            </div>
                                                            <div className={"flex items-center"}>
                                                                <div className="rating rating-sm pr-5">
                                                                    <input disabled checked type="radio" name="rating-1" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-1" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-1" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-1" className="mask mask-star-2 bg-warning" />
                                                                    <input disabled type="radio" name="rating-1" className="mask mask-star-2 bg-warning" />
                                                                </div>
                                                                <progress className="progress progress-warning w-[15em] sm:w-[25em] lg:w-[20em] 2xl:w-[25em]" value={0} max="100"/>
                                                            </div>
                                                        </div>
                                                    )
                                                }
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
                                                                    <p className={"pt-2 text-sm font-normal"}>
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


                                    <div className={"w-full lg:w-6/12 pt-10 lg:pt-0 lg:pl-3"}>
                                        <div className={"h-full bg-white shadow-xl rounded-xl flex flex-col"}>
                                            <div className={"sticky pt-8 px-8"}>
                                                <h2 className={"text-xl font-semibold"}>Suggested for you</h2>
                                            </div>
                                            <div className={"sm:px-3 flex overflow-y-auto h-full"}>
                                                {
                                                    !loadingRated && (
                                                        topRatedProducts.map(function (product, index) {
                                                            return <ProductItem key={index} product={product} smallSize={true} cardWidth={"w-[12em] sm:w-56"}/>
                                                        })
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )
            }
            <ReviewModal productId={productId} refetch={refetch} onPage={true}/>
        </>
    );
};



export default ProductPage;



// text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]
