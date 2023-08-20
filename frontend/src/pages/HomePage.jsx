// import React, {useEffect, useState} from 'react';
import ProductItem from "../components/ProductItem";
// import axios from "axios";
import {useGetProductsQuery, useGetProductsByRatingQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {useParams, Link} from "react-router-dom";
import Paginate from "../components/Paginate";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import {useEffect, useState} from "react";
import {HOME_IMAGE_1, HOME_IMAGE_3, HOME_IMAGE_2} from "../variables";
import Rating from "../components/Rating";
import {ReactComponent as Logo} from "../icons/e.svg"
import Meta from "../components/Meta";
import {useSelector} from "react-redux";


const HomePage = () => {

    const {pageNumber} = useParams();
    const { data, isLoading, error } = useGetProductsQuery({pageNumber});
    const { data: topRatedProducts, isLoading: loadingRated, error: errorRated } = useGetProductsByRatingQuery();
    const [slides, setSlides] = useState(window.innerWidth <= 640 ? 1 : window.innerWidth > 640 && window.innerWidth <= 1280 ? 2 : 3);
    const {userData} = useSelector(function (state) {
        return state.auth;
    });

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
            if (window.innerWidth <= 640) {
                setSlides(1);
            } else if (window.innerWidth > 640 && window.innerWidth <= 1280) {
                setSlides(2);
            } else {
                setSlides(3)
            }
        }
        window.addEventListener("resize", adjustSlides);
        // window.addEventListener("resize", () => window.innerWidth <= 640 ? setSlides(1) : window.innerWidth > 640 && window.innerWidth <= 1280 ? setSlides(2) : setSlides(3));
        return () => window.removeEventListener("resize", adjustSlides);
    }, [slides]);

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
                        <div className={"bg-base-100 shadow-xl rounded-xl"}>
                            <Swiper
                                autoplay={{
                                    delay: 7500,
                                    disableOnInteraction: false,
                                }}
                                modules={[Autoplay]}
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
                                                                    <span className={"font-bold text-white"}>Welcome</span>
                                                                    <span className={"px-3 text-neutral"}>to</span>
                                                                    <span className={"pt-2"}><Logo width={"34"} fill={"white"} height={"34"}/></span>
                                                                    <span className={"pl-3 text-neutral"}>-shop!</span>
                                                                </div>
                                                                <p className={"px-3 text-center text-white font-bold"}>
                                                                    An e-commerce site designed and developed by Oscar Castro
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
                        </div>
                        <div className={"px-3 pt-5 pb-3 flex justify-between items-center w-full"}>
                            <h2 style={{fontFamily: 'Ubuntu'}} className={"text-2xl"}>
                                Top Rated Products
                            </h2>
                            <Link to={"/sort/toprated"} className={"link text-sm"}>View All</Link>
                        </div>
                        <div className={"m-auto w-full rounded-xl max-w-7xl"}>
                            <div className={"p-3"}>
                                <Swiper
                                    spaceBetween={10}
                                    // centeredSlides={true}
                                    autoplay={{
                                        delay: 3500,
                                        disableOnInteraction: false,
                                    }}
                                    modules={[Autoplay, Navigation]}
                                    slidesPerView={slides}
                                    // pagination={{clickable: true}}
                                    navigation>
                                    {topRatedProducts.map(function (data, index) {
                                        return <SwiperSlide key={index}>
                                            <Link to={`/product/${data._id}`} className={"relative"}>
                                                <img
                                                    className={"bg-white shadow-sm sm:shadow-lg object-scale-down w-full xl:w-[385px] h-[307px] rounded-xl"}
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
                            </div>
                        </div>
                        <div className={"px-3 pt-5 pb-3 flex justify-between items-center w-full"}>
                            <h2 style={{fontFamily: 'Ubuntu'}} className={"text-2xl"}>
                                Lastest Products
                            </h2>
                            <Link to={"/sort/latest"} className={"link text-sm"}>View All</Link>
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
                                    <Paginate pages={data.pages} page={data.page}/>
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