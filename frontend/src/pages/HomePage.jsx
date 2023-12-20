import ProductItem from "../components/ProductItem";
import {useGetProductsQuery, useGetProductsByCategoryQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {useParams, Link} from "react-router-dom";
import Paginate from "../components/Paginate";
// import {Autoplay, Navigation, EffectFade} from "swiper/modules";
// import { Swiper, SwiperSlide} from "swiper/react";
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/autoplay';
// import 'swiper/css/effect-fade';
import {useEffect, useRef, useState} from "react";
// import Rating from "../components/Rating";
import {ReactComponent as Logo} from "../icons/e.svg"
import Meta from "../components/Meta";
// import {useSelector} from "react-redux";
import {motion} from "framer-motion";
import Footer from "../components/Footer";
// import {HOME_IMAGE_DAY, HOME_IMAGE_MORNING_EVENING, HOME_IMAGE_NIGHT, HOME_IMAGE_PAYPAL, HOME_IMAGE_SHIPPING} from "../variables";
import CategoryItem from "../components/CategoryItem";
import {FaChevronDown} from "react-icons/fa";
// import charizard from "../icons/charizard.gif";


const HomePage = () => {

    const {pageNumber} = useParams();
    // products query
    const { data, isLoading, error } = useGetProductsQuery({pageNumber});
    // top rated products query
    // const { data: topRatedProducts, isLoading: loadingRated, error: errorRated } = useGetProductsByRatingQuery();
    // products by category query
    const { data: productCategories, isLoading: loadingCategories, error: errorCategories } = useGetProductsByCategoryQuery();
    // component state
    // const [slides, setSlides] = useState(window.innerWidth <= 640 ? 1 : window.innerWidth > 640 && window.innerWidth <= 1280 ? 2 : 3);
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
    const [categoryDropdownActive, setCategoryDropdownActive] = useState(false);
    // const [charizardActive, setCharizardActive] = useState(false);
    // const [charizardPostion, setCharizardPosition] = useState(85);

    // current time
    // const date = new Date;
    // const time = date.getHours();
    // redux state
    // const {userData} = useSelector(function (state) {
    //     return state.auth;
    // });

    // pokemon animation *******
    // useEffect(() => {
    //     if (charizardActive) {
    //         setTimeout(() => {
    //             if (charizardPostion !== 5) {
    //                 setCharizardPosition(charizardPostion - 2.5);
    //             } else {
    //                 setCharizardPosition(85);
    //             }
    //         }, 150);
    //     }
    // }, [charizardPostion, charizardActive]);


    // set window width on resize
    useEffect( () => {
        const adjustWidth = () => {
            setWindowInnerWidth(window.innerWidth);
        }
        window.addEventListener("resize", adjustWidth);
        return () => window.removeEventListener("resize", adjustWidth);
    });
    // set number of slides based on window width
    // useEffect(() => {
    //     const adjustSlides = () => {
    //         if (windowInnerWidth <= 640) {
    //             setSlides(1);
    //         } else if (windowInnerWidth > 640 && windowInnerWidth <= 1280) {
    //             setSlides(2);
    //         } else if (windowInnerWidth > 1535) {
    //             setSlides(4)
    //         } else {
    //             setSlides(3)
    //         }
    //     }
    //     adjustSlides();
    // }, [windowInnerWidth]);

    // scroll to based on page number
    useEffect( () => {
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


    const scrollTo = useRef(null);


    // helper functions
    // const imageUrl = (hr) => {
    //     if (hr >= 21 || hr <= 5) {
    //         return HOME_IMAGE_NIGHT;
    //     } else if (hr >= 9 && hr <= 17) {
    //         return HOME_IMAGE_DAY;
    //     } else {
    //         return HOME_IMAGE_MORNING_EVENING;
    //     }
    // };
    // const greetingMessage = (hr) => {
    //     if (hr >= 4 && hr <= 11) {
    //         return "Good morning,";
    //     } else if (hr >= 12 && hr <= 17) {
    //         return "Good afternoon,";
    //     } else if (hr >= 0 && hr <= 3) {
    //         return <span>Hey there &#128564;, </span>;
    //     } else {
    //         return ("Good evening,");
    //     }
    // };
    const rotateChevron = (action) => {
        return action ? "open" : "closed";
    };


    return (
        <>
            {
                isLoading || loadingCategories ? (
                    <Spinner/>
                ) : error  || errorCategories ? (
                    <Message variant={"error"}>
                        {error?.data?.message || error.error || errorCategories.error || errorCategories?.data?.message}
                    </Message>
                ) : (
                    <>
                        <Meta title={"Home"} description={'Welcome to e-shop!'}/>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={"drop-shadow-xl bg-transparent rounded-xl w-full"}
                        >
                            <div className={"md:hidden w-full h-full relative"}>
                                <div className={"absolute h-full w-full flex flex-col items-center justify-start ibmplex"}>
                                    <Logo className={"pt-28 w-5/12"}/>
                                    <span className={"pt-12 text-3xl font-semibold z-10"}>Click, Ship, & Enjoy.</span>
                                    <span className={"pt-3 font-light pb-24 text-2xl"}>Happy Holidays!</span>
                                    <div className={"pb-20"}>
                                        <Link to={"/sort/latest/select/all"} className={"btn btn-neutral normal-case rounded-full"}>Shop Now</Link>
                                    </div>
                                </div>
                                <img className={"object-cover w-full"} src={"/images/markus-spiske-E7qI_Jqv4Dw-unsplash.jpg"}/>
                            </div>


                            {/*<div className={"md:hidden h-[25em]"}>*/}
                            {/*    <div*/}
                            {/*        style={{backgroundImage: `url(/images/the-halal-design-studio-gxDwmj6R3f4-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat"}}*/}
                            {/*        className={"h-full w-full"}*/}
                            {/*    >*/}
                            {/*        <div className={"w-full h-full flex items-end justify-center"}>*/}

                            {/*            <span className={"pb-10 font-bold text-white text-3xl roboto"}>*/}
                            {/*                We sell stuff online*/}
                            {/*            </span>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}


                            <div className={"hidden md:flex h-[35em] w-full ibmplex"}>
                                <div
                                    style={{backgroundImage: `url(/images/sincerely-media-HL3EOgFiy0k-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover"}}
                                    className={"h-full w-1/3"}
                                >
                                    <div className={"w-full h-full flex items-end justify-center"}>
                                        <span className={"pb-10 font-bold text-3xl"}>
                                            Shop Online
                                        </span>
                                    </div>
                                </div>
                                <div
                                    style={{backgroundImage: `url(/images/curology-fPSELOXfeU4-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover"}}
                                    className={"h-full w-1/3"}
                                >
                                    <div className={"w-full h-full flex items-start justify-center"}>
                                        <span className={"pt-20 px-10 font-bold text-white text-3xl"}>
                                            Deliver To Your Doorstep
                                        </span>
                                    </div>
                                </div>
                                <div
                                    style={{backgroundImage: `url(/images/ian-dooley-hpTH5b6mo2s-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover"}}
                                    className={"h-full w-1/3"}
                                >
                                    <div className={"w-full h-full flex items-center justify-center"}>
                                        <span className={"pt-14 font-bold text-white text-3xl"}>
                                           & Enjoy!
                                        </span>
                                    </div>
                                </div>
                                {/*<div className={"h-full w-1/3 flex items-end justify-center relative"}>*/}
                                {/*    <span className={"pb-10 text-3xl font-bold text-black roboto z-10"}>*/}
                                {/*        Shop Online*/}
                                {/*    </span>*/}
                                {/*    <img className={"absolute h-full w-full"} src={"/images/sincerely-media-HL3EOgFiy0k-unsplash.jpg"}/>*/}
                                {/*</div>*/}
                                {/*<div className={"h-full w-1/3 flex items-start justify-center relative"}>*/}
                                {/*    <span className={"pt-20 px-10 text-3xl font-bold text-white roboto z-10"}>*/}
                                {/*        Deliver To Your Doorstep*/}
                                {/*    </span>*/}
                                {/*    <img className={"absolute h-full w-full"} src={"/images/curology-fPSELOXfeU4-unsplash.jpg"}/>*/}
                                {/*</div>*/}
                                {/*<div className={"h-full w-1/3 flex items-center justify-center relative"}>*/}
                                {/*    <span className={"pt-14 text-3xl font-bold text-white roboto z-10"}>*/}
                                {/*        Enjoy!*/}
                                {/*    </span>*/}
                                {/*    <img className={"absolute h-full w-full"} src={"/images/ian-dooley-hpTH5b6mo2s-unsplash.jpg"}/>*/}
                                {/*</div>*/}
                            </div>
                        </motion.div>

                        {/*CATEGORIES*/}

                        <div className={"md:pt-20 pt-14 bg-black md:bg-neutral md:bg-white"}>
                            <div className={"h-12 bg-black md:bg-neutral border-none md:border-b-[1px] md:border-grey-300"}>
                                <div ref={scrollTo} className={"flex justify-center lg:justify-start items-center h-full w-full"}>
                                    <h2 className={"lg:pl-3 text-3xl md:text-2xl font-semibold text-white ibmplex"}>
                                        Categories
                                    </h2>
                                </div>
                            </div>

                            <div className={"w-full flex flex-wrap justify-center md:border py-8"}>
                                {
                                    productCategories.slice(0, !categoryDropdownActive && windowInnerWidth < 768 ? 6 : !categoryDropdownActive && windowInnerWidth < 1024 && windowInnerWidth >= 768 ? 4 : !categoryDropdownActive && windowInnerWidth > 1024 && windowInnerWidth < 1280 ? 5 : !categoryDropdownActive && windowInnerWidth >= 1280 && windowInnerWidth < 1282 ? 6 :
                                        !categoryDropdownActive && windowInnerWidth >= 1282 && windowInnerWidth < 1536 ? 7 :
                                        !categoryDropdownActive && windowInnerWidth > 1536 ? 8 : 8).map(function (product, index) {
                                       return <CategoryItem key={index} product={product} windowInnerWidth={windowInnerWidth}/>
                                    })
                                }
                            </div>
                            <div className={"pt-5"}>
                                <div className={"pb-10 flex justify-end items-center px-2"}>
                                    <div>
                                        {/*<Link to={"/sort/latest/select/all"} className={"btn glass bg-neutral/70 text-white"}>*/}
                                        {/*    View All Categories*/}
                                        {/*</Link>*/}
                                        <button onClick={() => setCategoryDropdownActive(!categoryDropdownActive)} className={"flex items-center text-lg font-semibold text-white md:text-black"}>
                                            <span className={"pr-2"}>
                                                {
                                                    categoryDropdownActive ? "Less Categories" : "More Categories"
                                                }
                                            </span>
                                             <div className={`${rotateChevron(categoryDropdownActive)}`}>
                                                 <FaChevronDown/>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                {/*<div className={"h-10 footer bg-neutral border-b-[1px] border-grey-300"}>*/}
                                    {/*<img onMouseOver={() => !charizardActive && setCharizardActive(true)} onClick={() => window.location.href = "https://oscar-ct.github.io/pok-mon/"} className={`w-14 ${!charizardActive && "opacity-50"}`} style={{position: "absolute", left: charizardPostion+"%", cursor: "pointer"}} src={charizard} alt={"charizard"}/>*/}
                                {/*</div>*/}
                            </div>
                        </div>

                        {/*LATEST PRODUCTS*/}
                        <div className={"pt-14 pb-10 md:pb-0"}>
                            <div className={"h-12 md:bg-neutral"}>
                                <div ref={scrollTo} className={"flex justify-center lg:justify-start items-center h-full w-full"}>
                                    <h2 className={"lg:pl-3 text-3xl md:text-2xl font-semibold md:text-white ibmplex"}>
                                        Lastest Products
                                    </h2>
                                </div>
                            </div>
                        </div>
                        {/*<div ref={scrollTo} className={"pt-20 pb-3 flex justify-center lg:justify-start items-center w-full"}>*/}
                        {/*    <h2 className={"text-3xl md:text-2xl font-bold text-neutral"}>*/}
                        {/*        Lastest Products*/}
                        {/*    </h2>*/}
                        {/*</div>*/}
                        <div className={"pb-10 "}>
                            <div className={"border-[1px] py-8 w-full flex flex-wrap justify-center"}>
                                {
                                    data.products.map(function (product) {
                                        return <ProductItem key={product._id} product={product} windowInnerWidth={windowInnerWidth}/>
                                    })
                                }
                            </div>
                            <div className={"pt-10 flex justify-center"}>
                                <div className={"join"}>
                                    <Paginate pages={data.pages} page={data.page} isHomePage={true}/>
                                </div>
                            </div>
                            {/*<div className={"pb-10"}>*/}
                            {/*    <div className={"pb-10 flex justify-end items-center rounded-xl"}>*/}
                            {/*        <Link to={"/sort/latest/select/all"} className={"text-2xl font-bold roboto text-neutral link"}>*/}
                            {/*            View All Products*/}
                            {/*        </Link>*/}
                            {/*    </div>*/}
                            {/*    <div className={"h-10 bg-black border-b-[1px] border-grey-300"}/>*/}
                            {/*</div>*/}
                        </div>

                        <Footer/>
                    </>
                )
            }

            {/*SWIPER ///////////////////////////////////////////////////////////////////////////////////////////////////////*/}

            {/*<Swiper*/}
            {/*    autoplay={{*/}
            {/*        delay: 8500,*/}
            {/*        disableOnInteraction: false,*/}
            {/*    }}*/}
            {/*    modules={[Autoplay, EffectFade]}*/}
            {/*    slidesPerView={1}*/}
            {/*    effect={"fade"}*/}
            {/*    // fadeEffect={{crossFade: true}}*/}
            {/*>*/}
            {/*    <SwiperSlide>*/}
            {/*        <div*/}
            {/*            style={{backgroundImage: `url(${imageUrl(time)})`, backgroundPosition: "center", backgroundSize: "cover"}}*/}
            {/*            className={"h-[24em] rounded-br-xl rounded-bl-xl"}*/}
            {/*        >*/}
            {/*            <div className={"absolute w-full h-full flex items-center justify-center"}>*/}
            {/*                <div*/}
            {/*                    style={{fontFamily: 'Ubuntu'}}*/}
            {/*                    className={"w-full px-3"}*/}
            {/*                >*/}
            {/*                    {*/}
            {/*                        userData ? (*/}
            {/*                            <>*/}
            {/*                                <div className={"w-full flex flex-col"}>*/}
            {/*                                    <div className={"text-6xl flex flex-wrap justify-center items-center"}>*/}
            {/*                                        <span className={`text-center font-bold ${time >= 9 && time <= 17 ? "text-neutral/90" : "text-white/90"}`}*/}
            {/*                                        >*/}
            {/*                                            {greetingMessage(time)}*/}
            {/*                                        </span>*/}
            {/*                                        <span className={`px-3 font-bold ${time >= 21 || time <= 5 ? "text-white/90" : "text-neutral/90" }`}*/}
            {/*                                        >*/}
            {/*                                            {userData.name.split(" ")[0]}!*/}
            {/*                                        </span>*/}
            {/*                                    </div>*/}
            {/*                                </div>*/}
            {/*                            </>*/}
            {/*                        ) : (*/}
            {/*                            <div className={"w-full flex flex-col"}>*/}
            {/*                                <div className={"text-6xl flex flex-wrap justify-center items-center"}>*/}
            {/*                                    <span className={`font-bold pr-4 ${time >= 21 || time <= 5 ? "text-white/90" : "text-neutral/90" }`}*/}
            {/*                                    >*/}
            {/*                                        Welcome to*/}
            {/*                                    </span>*/}
            {/*                                    <span className={"pt-2"}>*/}
            {/*                                        <Logo width={"34"} fill={"white"} height={"34"}/>*/}
            {/*                                    </span>*/}
            {/*                                    <span className={`pl-3 font-bold ${time >= 9 && time <= 17 ? "text-neutral/90" : "text-white/90"}`}*/}
            {/*                                    >*/}
            {/*                                        -shop!*/}
            {/*                                    </span>*/}
            {/*                                </div>*/}
            {/*                                <p className={`px-3 text-center ${time >= 9 && time <= 17 ? "text-neutral/90" : "text-white"}`}>*/}
            {/*                                    An e-commerce site designed and developed by <a className={"link"} href={"https://oscar-ct.com"}> Oscar Castro </a>*/}
            {/*                                </p>*/}
            {/*                            </div>*/}
            {/*                        )*/}
            {/*                    }*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </SwiperSlide>*/}
            {/*    <SwiperSlide>*/}
            {/*        <div*/}
            {/*            className={"h-[24em] rounded-br-xl rounded-bl-xl"}*/}
            {/*             style={{backgroundImage: `url(${HOME_IMAGE_PAYPAL})`, backgroundPosition: "center", backgroundSize: "cover"}}*/}
            {/*        >*/}
            {/*            <div className={"absolute w-full text-center h-full flex items-center justify-center"}>*/}
            {/*                <span style={{fontFamily: 'Ubuntu'}} className={"text-5xl text-white font-bold px-3"}>*/}
            {/*                    Shop safe and secure with PayPal*/}
            {/*                </span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </SwiperSlide>*/}
            {/*    <SwiperSlide>*/}
            {/*        <div*/}
            {/*            className={"h-[24em] rounded-br-xl rounded-bl-xl"}*/}
            {/*            style={{backgroundImage: `url(${HOME_IMAGE_SHIPPING})`, backgroundPosition: "center", backgroundSize: "cover"}}*/}
            {/*        >*/}
            {/*            <div className={"absolute w-full text-center h-full flex items-center justify-center"}>*/}
            {/*                <span style={{fontFamily: 'Ubuntu'}} className={"text-6xl text-white font-bold px-3"}>*/}
            {/*                    Fast 3-day shipping!*/}
            {/*                </span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </SwiperSlide>*/}
            {/*</Swiper>*/}



            {/*POKEMON //////////////////////////////////////////////////////////////////////////////////////////////////////*/}

            {/*<div className={"h-10 w-full relative hidden sm:flex"}>*/}
            {/*<img onMouseOver={() => !pikachuActive && setPikachuActive(true)} onClick={() => window.location.href = "https://oscar-ct.github.io/pok-mon/"} className={`w-10 ${!pikachuActive && "opacity-25"}`} style={{position: "absolute", left: pikachuPostion+"%"}} src={pikachu} alt={"charizard"}/>*/}
            {/*</div>*/}
            {/*<div className={"h-9 w-full relative"}>*/}
            {/*    <img onMouseOver={() => !charizardActive && setCharizardActive(true)} onClick={() => window.location.href = "https://oscar-ct.github.io/pok-mon/"} className={`w-14 ${!charizardActive && "opacity-25"}`} style={{position: "absolute", left: charizardPostion+"%"}} src={charizard} alt={"charizard"}/>*/}
            {/*</div>*/}

            {/*TOP RATED PRODUCTS //////////////////////////////////////////////////////////////////////////////////////////////*/}

            {/*<div className={"pt-8"}>*/}
            {/*    <div className={"px-3 pb-3 flex justify-center lg:justify-start items-center w-full"}>*/}
            {/*        <h2 className={"text-2xl lg:pl-2 roboto text-neutral"}>*/}
            {/*            Top Rated Products*/}
            {/*        </h2>*/}
            {/*        /!*<Link to={"/sort/toprated"} className={"link btn btn-sm btn-ghost normal-case text-sm"}>*!/*/}
            {/*        /!*    View All*!/*/}
            {/*        /!*</Link>*!/*/}
            {/*    </div>*/}
            {/*    <motion.div*/}
            {/*        initial={{ opacity: 0 }}*/}
            {/*        animate={{ opacity: 1 }}*/}
            {/*        exit={{ opacity: 0 }}*/}
            {/*        className={"m-auto w-full rounded-xl max-w-8xl px-3 pt-3"}*/}
            {/*    >*/}
            {/*        <Swiper*/}
            {/*            spaceBetween={windowInnerWidth > 1280 ? 15 : 10}*/}
            {/*            // centeredSlides={true}*/}
            {/*            autoplay={{*/}
            {/*                delay: 3500,*/}
            {/*                disableOnInteraction : false,*/}
            {/*            }}*/}
            {/*            modules={[Autoplay, Navigation]}*/}
            {/*            slidesPerView={slides}*/}
            {/*            navigation*/}
            {/*            // effect={"coverflow"}*/}
            {/*            // coverflowEffect={{slideShadows: false,*/}
            {/*            // rotate: 30}}*/}
            {/*        >*/}
            {/*            {topRatedProducts.map(function (data, index) {*/}
            {/*                return <SwiperSlide key={index}>*/}
            {/*                    <Link to={`/product/${data._id}`} className={"relative"}>*/}
            {/*                        <motion.img*/}
            {/*                            whileHover={windowInnerWidth > 640 ? { scale: 0.95} : {scale: "none"}}*/}
            {/*                            className={"bg-white shadow-xl object-scale-down w-full xl:w-[385px] h-[275px] rounded-xl"}*/}
            {/*                            src={data.images.length !== 0 ? data.images[0].url : "/images/sample.jpg"} alt={"products"}*/}
            {/*                        />*/}
            {/*                        <div className={"flex justify-center items-end"}>*/}
            {/*                            <span className={"rounded-tl-md rounded-br-xl pt-4 px-2 text-xs sm:text-sm truncate roboto"}>*/}
            {/*                                {data.name}*/}
            {/*                            </span>*/}
            {/*                        </div>*/}
            {/*                    </Link>*/}
            {/*                    <div className={"absolute right-0 top-0 "}>*/}
            {/*                        <div className={"p-2 rounded-bl-md rounded-tr-xl"}>*/}
            {/*                            <Rating rating={data.rating}/>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </SwiperSlide>*/}
            {/*            })}*/}
            {/*        </Swiper>*/}
            {/*    </motion.div>*/}
            {/*    <div className={"py-5"}>*/}
            {/*        <div className={"h-20 flex justify-end rounded-xl"}>*/}
            {/*            <div className={"flex justify-between items-center"}>*/}
            {/*                <span className={"text-center pr-3 text-lg roboto"}>*/}
            {/*                    Checkout all our top rated products*/}
            {/*                </span>*/}
            {/*                <div className={"pr-5"}>*/}
            {/*                    <Link to={"/sort/toprated/select/all"} className={"w-24 btn glass bg-neutral/70 text-white"}>*/}
            {/*                        View All*/}
            {/*                    </Link>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className={"bg-black border-b-[1px] border-grey-300"}/>*/}
            {/*</div>*/}



        </>
    );
};

export default HomePage;