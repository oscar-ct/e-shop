import {ReactComponent as Logo} from "../icons/e.svg";
import {Link} from "react-router-dom";
import { Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Pagination, EffectFade} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import {FaCcPaypal} from "react-icons/fa";
import {motion} from "framer-motion";
import CustomBtn from "./CustomBtn";


const HomePageIntro = () => {
    return (
        <div className={"lg:drop-shadow-xl bg-transparent"}>

            {/*MOBILE*/}
            <motion.div
                className={"md:hidden w-full h-full relative"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                    >
                <div className={"absolute h-full w-full flex flex-col items-center justify-start ibmplex"}>
                    <Logo className={"pt-28 w-[10em]"}/>
                    <span className={"pt-12 text-3xl font-semibold text-netural"}>Shop, Ship, & Enjoy.</span>
                    <div className={"pt-20 z-10"}>
                        <Link to={"/sort/latest/select/all"}>
                            <CustomBtn customClass={"!px-12 bg-zinc-700 text-lg"}>
                                Shop Now
                            </CustomBtn>
                        </Link>
                    </div>
                </div>
                <img className={"fadeInEffect object-cover h-[40em] w-full"} src={"/images/bg.png"} alt="colorful-art"/>
            </motion.div>
            {/*MOBILE*/}

            {/*DESKTOP*/}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className={"hidden md:block w-full"}>
                    <div className={"flex h-[32em] w-full ibmplex"}>
                        <div
                            style={{backgroundImage: `url(/images/sincerely-media-HL3EOgFiy0k-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover"}}
                            className={"h-full w-1/3"}
                        >
                            <div className={"w-full h-full flex items-end justify-center"}>
                                <div className={"pb-10 text-3xl font-bold flex items-center"}>
                                    <Logo width={"20px"} className={"pt-1 mr-1"}/>
                                    -shop.com
                                </div>
                            </div>
                        </div>
                        <div
                            style={{backgroundImage: `url(/images/curology-fPSELOXfeU4-unsplash.webp)`, backgroundPosition: "center", backgroundSize: "cover"}}
                            className={"h-full w-1/3"}
                        >
                            <div className={"w-full h-full flex items-start justify-center"}>
                                <div className={"pt-20 px-10 font-bold text-white text-3xl"}>
                                    Shop, Ship, & Enjoy.
                                </div>
                            </div>
                        </div>
                        <div className={"w-1/3 h-full"}>
                            <Swiper
                                pagination
                                slidesPerView={1}
                                autoplay={{
                                    delay: 8500,
                                    disableOnInteraction: false
                                }}
                                modules={[Autoplay, EffectFade, Pagination]}
                                effect={"fade"}
                                fadeEffect={{crossFade: true}}
                            >
                                <SwiperSlide>
                                    <div
                                        style={{backgroundImage: `url(/images/bg.png)`, backgroundPosition: "center", backgroundSize: "cover",}}
                                        className={"h-[32em]"}
                                    >
                                    {/*<div*/}
                                    {/*    style={{backgroundImage: `url(/images/ian-dooley-hpTH5b6mo2s-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover",}}*/}
                                    {/*    className={"h-[32em]"}*/}
                                    {/*>*/}
                                        <div className={"w-full h-full flex flex-col items-center justify-center"}>
                                            <Logo className={"py-20 w-[10em]"}/>
                                            <Link to={"/sort/latest/select/all"}>
                                                <CustomBtn customClass={"!px-8 bg-zinc-700 shadow-sm !shadow-zinc-600"}>
                                                    Shop Now
                                                </CustomBtn>
                                            </Link>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div
                                        style={{backgroundImage: `url(/images/muhammad-asyfaul-f2tNsobMisQ-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover",}}
                                        className={"h-[32em]"}
                                    >
                                        <div className={"w-full h-full flex items-end justify-end"}>

                                            <div className={"p-10 w-full flex flex-col items-center justify-center"}>
                                                <span className={"p-2 text-3xl text-white font-bold"}>Shop with confidence</span>
                                                <FaCcPaypal color={"white"} size={"3em"}/>
                                            </div>
                                        </div>

                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/*DESKTOP*/}
        </div>
    );
};

export default HomePageIntro;