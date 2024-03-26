import {ReactComponent as Logo} from "../icons/e.svg";
import {Link} from "react-router-dom";
import { Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Pagination, EffectFade} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import CustomBtn from "./CustomBtn";
import {ReactComponent as PaypalLogo} from "../icons/paypal-logo.svg";
import {ReactComponent as StripeLogo} from "../icons/stripe-logo.svg";
import {motion} from "framer-motion";
import Reveal from "./Reveal";
import {useSelector} from "react-redux";

const HomePageIntro = () => {

    const {userData} = useSelector(function (state) {
        return state.auth;
    });

    return (
        <div className={"md:pb-14 bg-black md:bg-transparent"}>
            {/*MOBILE*/}

            <motion.div
                className={"md:hidden w-full h-full relative"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className={"z-10 absolute h-full w-full flex flex-col items-center justify-start ibmplex"}>
                    <Logo fill={"white"} className={"pt-28 w-[10em]"}/>
                    <span className={"pt-12 text-3xl font-semibold text-white md:text-neutral"}>Shop, Ship, & Enjoy.</span>
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
            <Reveal>
                <div className={"hidden md:block w-full"}>
                    <div className={"flex h-[32em] w-full ibmplex"}>
                        {/*<div*/}
                        {/*    style={{backgroundImage: `url(https://images.unsplash.com/photo-1463171379579-3fdfb86d6285?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`, backgroundPosition: "center", backgroundSize: "cover"}}*/}
                        {/*    className={"h-full w-2/3"}*/}
                        {/*>*/}
                        <div
                            style={{backgroundImage: `url(/images/kelly-sikkema-mdADGzyXCVE-unsplash.webp)`, backgroundPosition: "center", backgroundSize: "cover"}}
                            className={"h-full w-1/3"}
                        >
                            <div className={"w-full h-full flex items-center justify-center"}>

                                    {
                                        userData ? (
                                            <div className={"flex flex-col justify-center items-center text-2xl font-base"}>
                                                <span>Welcome back, </span>
                                                <span className={"truncate"}>{userData.name.split(" ")[0].substring(0, 13)}</span>
                                            </div>
                                        ) : (
                                            <div className={"text-3xl font-base flex items-center"}>
                                                <Logo width={"20px"} className={"pt-1 mr-1"}/>
                                                -shop
                                            </div>
                                        )
                                    }


                            </div>
                        </div>
                        <div
                            style={{backgroundImage: `url(images/sunder-muthukumaran-yaQqV9o1ZXc-unsplash.webp)`, backgroundPosition: "left", backgroundSize: "cover"}}
                            className={"h-full w-1/3"}
                        >
                            <div className={"w-full h-full flex flex-col items-center justify-between"}>
                                <div className={"pt-8 px-10 font-base text-white text-3xl text-center flex"}>
                                    Enjoy online shopping
                                </div>
                                <div className={"pb-8 px-10  flex flex-col justify-center items-center"}>
                                    <div className={"font-base text-white text-3xl text-center"}>
                                    with FREE shipping
                                    </div>
                                    <div className={"text-xs text-white"}>
                                        when you spend over $100
                                    </div>
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
                                        style={{backgroundImage: `url(/images/markus-winkler-ahjzVINkuCs-unsplash.webp)`, backgroundPosition: "center", backgroundSize: "cover",}}
                                        className={"h-[32em]"}
                                    >
                                        <div className={"w-full h-full flex items-end justify-end"}>

                                            <div className={"p-10 w-full h-full flex flex-col items-between justify-between"}>
                                                <div className={"flex flex-col items-start justify-start"}>
                                                    <span className={"px-2 pb-3 text-3xl font-base"}>Pay safely with</span>
                                                    {/*<FaCcPaypal color={"white"} size={"3em"}/>*/}
                                                    <div className={"w-full lg:pl-8 flex items-center justify-start"}>
                                                        <StripeLogo width={90}/>
                                                        <div className={"flex flex-col pl-3 pr-4"}>
                                                            <div className={"flex justify-center"}>
                                                                <span className={"h-5 bg-[#635bff] pl-[1px]"}/>
                                                            </div>
                                                            <div className={"py-1 text-lg text-[#635bff] flex items-center"}>
                                                                &
                                                            </div>
                                                            <div className={"flex justify-center"}>
                                                                <span className={"h-5 bg-[#635bff] pl-[1px]"}/>
                                                            </div>
                                                        </div>
                                                        <PaypalLogo width={60}/>
                                                    </div>
                                                </div>
                                                <Link to={"/sort/latest/select/all"}>
                                                    <CustomBtn customClass={"bg-zinc-700"}>
                                                        Shop Now
                                                    </CustomBtn>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div
                                        style={{backgroundImage: `url(/images/bg.png)`, backgroundPosition: "center", backgroundSize: "cover",}}
                                        className={"h-[32em] bg-zinc-400"}
                                    >
                                    {/*<div*/}
                                    {/*    style={{backgroundImage: `url(/images/ian-dooley-hpTH5b6mo2s-unsplash.jpg)`, backgroundPosition: "center", backgroundSize: "cover",}}*/}
                                    {/*    className={"h-[32em]"}*/}
                                    {/*>*/}
                                        <div className={"w-full h-full flex flex-col items-center justify-evenly pb-5"}>
                                            <div className={"pt-3 w-full flex justify-center"}>
                                                <div className={"text-3xl text-white font-base px-12 text-center"}>Meet the developer</div>
                                            </div>
                                            <div className="avatar">
                                                <div className="w-48 mask mask-squircle">
                                                    <img alt={"headshot"} src={"/images/codeup-final.webp"}/>
                                                </div>
                                            </div>
                                            <div className={"flex flex-col items-center text-white"}>
                                                <span className={"text-2xl font-base"}>Oscar Castro</span>
                                                <a className={"link link-primary"} href={"mailto:oscar.a.castro818@gmail.com"}>oscar.a.castro818@gmail.com</a>
                                            </div>
                                            <a aria-label="portfolio" href={"https://oscar-ct.com/"} target="_blank" rel="noopener noreferrer">
                                                <CustomBtn>
                                                    Learn More
                                                </CustomBtn>
                                            </a>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </Reveal>
            {/*DESKTOP*/}
        </div>
    );
};

export default HomePageIntro;