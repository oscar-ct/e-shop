// import React, {useEffect, useState} from 'react';
import ProductItem from "../components/ProductItem";
// import axios from "axios";
import {useGetProductsQuery, useGetProductsByRatingQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {useParams, Link} from "react-router-dom";
import Paginate from "../components/Paginate";
import {Autoplay, EffectCoverflow, Navigation} from "swiper/modules";
import { Swiper, SwiperSlide, } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import {useEffect, useRef, useState} from "react";
import {HOME_IMAGE_1, HOME_IMAGE_3, HOME_IMAGE_2} from "../variables";
import Rating from "../components/Rating";
import {ReactComponent as Logo} from "../icons/e.svg"
import Meta from "../components/Meta";
import {useSelector} from "react-redux";
import {motion} from "framer-motion";


const HomePage = () => {

    const {pageNumber} = useParams();
    const { data, isLoading, error } = useGetProductsQuery({pageNumber});
    const { data: topRatedProducts, isLoading: loadingRated, error: errorRated } = useGetProductsByRatingQuery();
    const [slides, setSlides] = useState(window.innerWidth <= 640 ? 1 : window.innerWidth > 640 && window.innerWidth <= 1280 ? 2 : 3);
    const {userData} = useSelector(function (state) {
        return state.auth;
    });
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);

    useEffect(function () {
        const adjustWidth = () => {
            setWindowInnerWidth(window.innerWidth);
        }
        window.addEventListener("resize", adjustWidth);
        return () => window.removeEventListener("resize", adjustWidth);
    })

    // const [products, setProducts] = useState([]);
    // useEffect(function () {
    //     const fetchProducts = async () => {
    //         const { data } = await axios.get('/api/products');
    //         setProducts(data);
    //
    //     }
    //     fetchProducts();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        const adjustSlides = () => {
            if (windowInnerWidth <= 640) {
                setSlides(1);
            } else if (windowInnerWidth > 640 && windowInnerWidth <= 1280) {
                setSlides(2);
            } else if (windowInnerWidth > 1535) {
                setSlides(4)
            } else {
                setSlides(3)
            }
        }
        adjustSlides();
        // window.addEventListener("resize", adjustSlides);
        // window.addEventListener("resize", () => window.innerWidth <= 640 ? setSlides(1) : window.innerWidth > 640 && window.innerWidth <= 1280 ? setSlides(2) : setSlides(3));
        // return () => window.removeEventListener("resize", adjustSlides);
    }, [windowInnerWidth]);

    const scrollTo = useRef(null);

    useEffect(function () {
        const executeScroll = () => {
            if (scrollTo) {
                var headerOffset = 70;
                var elementPosition = scrollTo.current.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                // scrollTo.current.scrollIntoView({behavior: "smooth", block: "start"})
            }
        };
        if ((data && pageNumber) && (data?.page !== pageNumber)) {
            executeScroll();
        }
    }, [data, pageNumber, data?.page]);

    return (
        <>
            {
                isLoading || loadingRated ? (
                    <Spinner/>
                ) : error || errorRated ? (
                    <Message variant={"error"} children={error?.data?.message || error.error || errorRated.error || errorRated?.data?.message}/>
                ) : (
                    <>
                        <Meta title={"Home"}/>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={"drop-shadow-xl bg-transparent rounded-xl"}
                        >
                            <Swiper
                                autoplay={{
                                    delay: 7500,
                                    disableOnInteraction: false,
                                }}
                                modules={[Autoplay,]}
                                slidesPerView={1}
                            >
                                <SwiperSlide>
                                    <div style={{background: `url(${HOME_IMAGE_1})`,  backgroundPosition: "center", backgroundSize: "cover"}}
                                        className={"h-[25em] rounded-br-xl rounded-bl-xl"}
                                    >
                                        <div className={"absolute w-full h-full flex items-center justify-center"}>

                                                <div style={{fontFamily: 'Ubuntu'}} className={"w-full px-3"}>

                                                    {
                                                        userData ? (
                                                            <>
                                                                <div className={"w-full flex flex-col"}>
                                                                    <div className={"text-6xl flex flex-wrap justify-center items-center"}>
                                                                        <span className={"font-semibold text-neutral"}>Welcome,</span>
                                                                        <span className={"px-3 font-bold text-white"}>{userData.name.split(" ")[0]}!</span>
                                                                    </div>
                                                                    {/*<p className={"px-3 text-center text-base-100 font-bold"}>*/}

                                                                    {/*</p>*/}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className={"w-full flex flex-col"}>
                                                                <div className={"text-6xl flex flex-wrap justify-center items-center"}>
                                                                    <span className={"font-bold text-neutral"}>Welcome</span>
                                                                    <span className={"px-3 text-neutral font-bold"}>to</span>
                                                                    <span className={"pt-2"}><Logo width={"34"} fill={"white"} height={"34"}/></span>
                                                                    <span className={"pl-3 text-white font-bold"}>-shop!</span>
                                                                </div>
                                                                <p className={"px-3 text-center text-white font-bold"}>
                                                                    An e-commerce site designed and developed by <a className={"link"} href={"https://oscar-ct.com"}> Oscar Castro </a>
                                                                </p>
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            </div>

                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div
                                        className={"h-[25em] rounded-br-xl rounded-bl-xl"}
                                         style={{background: `url(${HOME_IMAGE_2})`, backgroundPosition: "center", backgroundSize: "cover"}}
                                    >
                                        <div className={"absolute w-full text-center h-full flex items-center justify-center"}>
                                            <span style={{fontFamily: 'Ubuntu'}} className={"text-5xl text-white font-bold px-3"}>
                                                Shop safe and secure with PayPal
                                            </span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div
                                        className={"h-[25em] rounded-br-xl rounded-bl-xl"}
                                        style={{background: `url(${HOME_IMAGE_3})`, backgroundPosition: "center", backgroundSize: "cover"}}
                                    >
                                        <div className={"absolute w-full text-center h-full flex items-center justify-center"}>
                                            <span style={{fontFamily: 'Ubuntu'}} className={"text-6xl text-white font-bold px-3"}>
                                                Fast 3-day shipping!
                                            </span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </motion.div>
                        <div className={"px-3 pt-5 pb-3 flex justify-between items-center w-full"}>
                            <h2 className={"text-2xl"}>
                                Top Rated Products
                            </h2>
                            <Link to={"/sort/toprated"} className={"btn btn-sm btn-ghost normal-case text-sm"}>View All</Link>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={"m-auto w-full rounded-xl max-w-8xl px-3 pt-3"}
                        >
                            {/*<div className={"p-3"}>*/}
                                <Swiper
                                    spaceBetween={22}
                                    // centeredSlides={true}
                                    autoplay={{
                                        delay: 3500,
                                        disableOnInteraction : false,
                                    }}
                                    modules={[Autoplay, Navigation, EffectCoverflow]}
                                    slidesPerView={slides}
                                    navigation
                                    effect={"coverflow"}
                                    coverflowEffect={{slideShadows: false,
                                    rotate: 30}}
                                >
                                    {topRatedProducts.map(function (data, index) {
                                        return <SwiperSlide key={index}>
                                            <Link to={`/product/${data._id}`} className={"relative"}>
                                                <img className={"sm:hover:scale-[.95] sm:duration-200 bg-white/90 drop-shadow-xl object-scale-down w-full xl:w-[385px] h-[307px] rounded-xl"}
                                                    src={data.images.length !== 0 ? data.images[0].url : "/images/sample.jpg"} alt={"products"}/>
                                                <div className={"flex justify-start items-end"}>
                                                    <h5 className={"rounded-tl-md rounded-br-xl p-2 text-xs sm:text-sm font-semibold truncate"}>${data.price} - {data.name}</h5>
                                                </div>
                                            </Link>
                                            <div className={"absolute right-0 top-0 "}>
                                                <div className={"p-2 rounded-bl-md rounded-tr-xl"}>
                                                    <Rating rating={data.rating}/>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    })}
                                </Swiper>
                            {/*</div>*/}
                        </motion.div>
                        <div ref={scrollTo} className={"px-3 pt-5 pb-3 flex justify-between items-center w-full"}>
                            <h2 className={"text-2xl"}>
                                Lastest Products
                            </h2>
                            <Link to={"/sort/latest"} className={"btn btn-sm btn-ghost normal-case text-sm "}>View All</Link>
                        </div>
                        <div className={"pb-10"}>
                            {/*<h2 style={{fontFamily: 'Ubuntu'}} className={"text-2xl py-3 text-center lg:text-start"}>*/}
                            {/*    Lastest Products*/}
                            {/*</h2>*/}
                            <div className={"w-full flex flex-wrap justify-center"}>
                                {
                                    data.products.map(function (product) {
                                        return <ProductItem key={product._id} product={product}/>
                                    })
                                }
                            </div>
                            <div className={"pt-10 flex justify-center"}>
                                <div className={"join"}>
                                    <Paginate pages={data.pages} page={data.page} isHomePage={true}/>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

        </>
    );
};

export default HomePage;