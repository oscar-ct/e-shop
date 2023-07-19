// import React, {useEffect, useState} from 'react';
import Product from "../components/Product";
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
                                                <div className={"h-[32em] rounded-br-xl rounded-bl-xl"} style={{background: "url(https://plus.unsplash.com/premium_photo-1681488484866-af8f282d59ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1557&q=80)", backgroundPosition: "bottom", backgroundSize: "cover"}}>
                                                    <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                                                        <span style={{fontFamily: 'Ubuntu'}} className={"text-6xl"}>Welcome to e-shop!</span>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={"h-[32em] rounded-br-xl rounded-bl-xl"} style={{background: "url( https://images.unsplash.com/photo-1641350625112-3b1d73c71418?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80)", backgroundPosition: "center", backgroundSize: "cover"}}>
                                                    <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                                                        <span style={{fontFamily: 'Ubuntu'}} className={"text-5xl text-white font-bold"}>Shop safe and secure with PayPal</span>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className={"h-[32em] rounded-br-xl rounded-bl-xl"} style={{background: "url(https://images.unsplash.com/photo-1524678714210-9917a6c619c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80)", backgroundPosition: "top", backgroundSize: "cover"}}>
                                                    <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                                                        <span style={{fontFamily: 'Ubuntu'}} className={"text-6xl"}>Fast 3-day shipping! </span>
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
                                                                className={"rounded-xl"}
                                                                src={data.images[0].url} alt={"products"}/>
                                                            <div className={"opacity-70 p-2 rounded-tl-lg bg-white absolute bottom-0 right-0"}>
                                                                <h5 className={"sm:text-xs"}>{data.name} - ${data.price}</h5>
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
                                        return <Product key={product._id} product={product}/>
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