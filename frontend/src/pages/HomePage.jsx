// import React, {useEffect, useState} from 'react';
import ProductItem from "../components/ProductItem";
// import axios from "axios";
import {useGetProductsQuery, useGetProductsByRatingQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {useParams, Link} from "react-router-dom";
import Paginate from "../components/Paginate";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import {useEffect, useState} from "react";
import {HOME_IMAGE_1, HOME_IMAGE_3, HOME_IMAGE_2} from "../variables";
import Rating from "../components/Rating";




const HomePage = () => {

    const {searchTerm, pageNumber} = useParams();
    const { data, isLoading, error } = useGetProductsQuery({searchTerm, pageNumber});
    const { data: topRatedProducts, isLoading: loadingRated, error: errorRated } = useGetProductsByRatingQuery();
    const [slides, setSlides] = useState(window.innerWidth <= 640 ? 1 : window.innerWidth > 640 && window.innerWidth <= 1280 ? 2 : 3);

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
        window.addEventListener("resize", () => window.innerWidth <= 640 ? setSlides(1) : window.innerWidth > 640 && window.innerWidth <= 1280 ? setSlides(2) : setSlides(3));
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
                        {
                            !searchTerm && (
                                <>
                                    <div>
                                        <Swiper
                                            autoplay={{
                                                delay: 7500,
                                                disableOnInteraction: false,
                                            }}
                                            modules={[Autoplay]}
                                            slidesPerView={1}
                                        >
                                            <SwiperSlide>
                                                <div
                                                    className={"h-[25em] rounded-br-xl rounded-bl-xl"}
                                                     style={{background: `url(${HOME_IMAGE_1})`, backgroundPosition: "top", backgroundSize: "cover"}}
                                                >
                                                    <div className={"absolute w-full text-center top-[40%]"}>
                                                        <span style={{fontFamily: 'Ubuntu'}} className={"text-6xl"}>
                                                            <span className={"font-bold text-base-100"}>
                                                                Welcome
                                                            </span> to e-shop!
                                                        </span>
                                                        <div className={"text-white font-bold"}>
                                                            A site created and developed by Oscar Castro
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div
                                                    className={"h-[25em] rounded-br-xl rounded-bl-xl"}
                                                     style={{background: `url(${HOME_IMAGE_2})`, backgroundPosition: "center", backgroundSize: "cover"}}
                                                >
                                                    <div className={"absolute w-full text-center top-[40%]"}>
                                                        <span style={{fontFamily: 'Ubuntu'}} className={"text-5xl text-white font-bold"}>
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
                                                    <div className={"absolute w-full text-center top-[40%]"}>
                                                        <span style={{fontFamily: 'Ubuntu'}} className={"text-6xl text-white font-bold"}>
                                                            Fast 3-day shipping!
                                                        </span>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>

                                    <h2 style={{fontFamily: 'Ubuntu'}} className={"text-2xl py-5 text-center lg:text-start"}>
                                        Top Rated Products
                                    </h2>
                                    <div className={"m-auto w-full rounded-xl bg-base-100 shadow-xl max-w-7xl"}>
                                        <div className={"p-3"}>
                                            <Swiper
                                                spaceBetween={10}
                                                // centeredSlides={true}
                                                autoplay={{
                                                    delay: 3500,
                                                    disableOnInteraction: false,
                                                }}
                                                modules={[Autoplay, Navigation, Pagination]}
                                                slidesPerView={slides}
                                                pagination={{clickable: true}}
                                                navigation>
                                                {topRatedProducts.map(function (data, index) {
                                                    return <SwiperSlide key={index}>
                                                        <Link to={`/product/${data._id}`} className={"relative"}>
                                                            <img
                                                                className={"object-cover w-full xl:w-[385px] h-[307px] rounded-xl"}
                                                                src={data.images.length !== 0 ? data.images[0].url : "/images/sample.jpg"} alt={"products"}/>
                                                            <div className={"opacity-90 p-2 rounded-tl-lg bg-white absolute bottom-0 right-0"}>
                                                                <h5 className={"sm:text-xs"}>{data.name} - ${data.price}</h5>
                                                            </div>
                                                            <div className={"opacity-90 p-2 rounded-bl-lg bg-white absolute top-0 right-0"}>
                                                                <Rating rating={data.rating}/>
                                                            </div>
                                                        </Link>
                                                    </SwiperSlide>
                                                })}
                                            </Swiper>
                                        </div>
                                    </div>
                                </>

                            )
                        }

                        <div className={"pt-3 pb-10"}>
                            {
                                searchTerm ? (
                                    <h2 className={"text-2xl px-2 py-7"}>Search results...</h2>
                                ) : (
                                    <h2 style={{fontFamily: 'Ubuntu'}} className={"text-2xl py-3 text-center lg:text-start"}>Recently Added</h2>
                                )
                            }

                            <div className={"w-full flex flex-wrap justify-center"}>
                                {
                                    data.products.map(function (product) {
                                        return <ProductItem key={product._id} product={product}/>
                                    })
                                }
                            </div>
                            <div className={"pt-10 flex justify-center"}>
                                <div className={"join"}>
                                    <Paginate pages={data.pages} page={data.page} searchTerm={searchTerm}/>
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