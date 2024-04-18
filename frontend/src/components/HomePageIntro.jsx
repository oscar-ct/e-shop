import {ReactComponent as Logo} from "../icons/e.svg";
import {Link, useNavigate} from "react-router-dom";
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
import {useEffect, useState} from "react";
import CategoryItem from "./CategoryItem";

const HomePageIntro = ({scrollY, productCategories, windowInnerWidth}) => {

    const {userData} = useSelector(function (state) {
        return state.auth;
    });
    const navigate = useNavigate();

    const [animateClassName, setAnimateClassName] = useState("");
    const rgb = [
        "#ff0000",
        "#ff7300",
        '#fffb00',
        "#48ff00",
        "#00ffd5",
        "#002bff",
        "#7a00ff",
        '#ff00c8',
        "#ff0000"
    ];

    const [logoColor, setLogoColor] = useState("white");

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setLogoColor(rgb[Math.floor(Math.random() * rgb.length)])
    //     }, 3000);
    //     return () => clearInterval(interval);
    // }, [])

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //     }, 1000);
    //     return () => clearTimeout(timeout);
    // }, []);

    useEffect(() => {
        if (scrollY === 0) {
            setAnimateClassName("animate-ping");
            setTimeout(() => {
                setAnimateClassName("hidden");
            }, 1000);
        }
    }, [scrollY])

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

                <div className={"hidden md:block w-full"}>
                    <div className={"flex h-[55em] w-full ibmplex"}>
                        <div
                            style={{
                                backgroundImage: `url(/images/maxim-berg-qpL0cRkLJn8-unsplash.webp)`,
                                backgroundPosition: "bottom",
                                backgroundSize: "cover",
                                // transform: "scale(1.1)",
                                // transition: "all 2s ease-in"
                            }}
                            className={"h-full w-full"}
                        >
                            <div className={"backdrop-blur-sm w-full h-full flex flex-col items-center justify-between"}>
                                <Reveal>
                                    <div className={"flex h-[32em] w-full ibmplex"}>
                                        <div
                                            style={{backgroundImage: `url(/images/kelly-sikkema-mdADGzyXCVE-unsplash.webp)`, backgroundPosition: "center", backgroundSize: "cover",}}
                                            className={"h-full w-1/3 rounded-br-full"}
                                        >
                                            <div className={"w-full h-full flex items-center justify-center"}>
                                                {
                                                    userData ? (
                                                        <div className={"flex flex-col justify-center items-center text-2xl font-bold"}>
                                                            <span>Welcome back, </span>
                                                            <span className={"truncate"}>{userData.name.split(" ")[0].substring(0, 13)}</span>
                                                        </div>
                                                    ) : (
                                                        <div className={"text-3xl font-bold flex flex-col justify-center items-center"}>
                                                            <span>Welcome to</span>
                                                            <div className={"flex pt-2"}>
                                                                <Logo width={"20px"} className={"pt-1 mr-1"}/>
                                                                -shop
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className={"h-full w-1/3"}>
                                            <div className={"w-full h-full flex flex-col items-center justify-center"}>
                                                <div className={"h-48 relative w-full"}>
                                                    <div className={`${animateClassName} absolute bottom-0 left-0 h-56 w-56 bg-white/5 rotate-45 -translate-y-0 -translate-x-[16em] rounded-br-full`}/>
                                                    <div className={`${animateClassName} z-20 absolute bottom-0 right-0 h-56 w-56 bg-white/5 rotate-45 -translate-y-0 translate-x-[16em] rounded-bl-full`}/>
                                                </div>
                                                <div className={"py-10 px-10 w-full flex flex-col justify-center items-center"}>
                                                    <motion.span
                                                        onDoubleClick={() => navigate("/search/snake")}
                                                        onMouseEnter={() => setLogoColor(rgb[Math.floor(Math.random() * rgb.length)])}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 1.0 }}
                                                        className={`fadeInEffect -rotate-90`}
                                                    >
                                                        <Logo fill={logoColor} className={"w-[6em] opacity-70"}/>
                                                    </motion.span>
                                                    <div className={"font-semibold text-white text-[2vw] text-center pt-8"}>
                                                        Enjoy online shopping with <span className={"font-bold text-violet-600"}>FREE</span> shipping!
                                                    </div>
                                                    <div className={"text-xs text-zinc-200 font-light"}>
                                                        when you spend over $100
                                                    </div>
                                                </div>
                                                <Link className={"pt-6"} to={"/sort/latest/select/all"}>
                                                    <CustomBtn customClass={""}>
                                                        Shop Now
                                                    </CustomBtn>
                                                </Link>
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
                                                modules={[EffectFade, Pagination, Autoplay]}
                                                effect={"fade"}
                                                fadeEffect={{crossFade: true}}
                                            >
                                                <SwiperSlide>
                                                    <div
                                                        style={{backgroundImage: `url(/images/markus-winkler-ahjzVINkuCs-unsplash.webp)`, backgroundPosition: "center", backgroundSize: "cover",}}
                                                        className={"h-[32em] rounded-bl-full"}
                                                    >
                                                        <div className={"w-full h-full flex items-end justify-end"}>

                                                            <div className={"p-10 w-full h-full flex flex-col items-between justify-between"}>
                                                                <div className={"flex flex-col items-start justify-start"}>
                                                                    <span className={"px-2 pb-3 text-3xl font-bold"}>Pay safely with</span>
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
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                                <SwiperSlide>
                                                    <div
                                                        style={{backgroundImage: `url(/images/bg.png)`, backgroundPosition: "center", backgroundSize: "cover",}}
                                                        className={"h-[32em] bg-zinc-800 rounded-bl-full"}
                                                    >
                                                        <div className={"w-full h-full flex flex-col items-center justify-evenly pb-5"}>
                                                            <div className={"pt-3 w-full flex justify-center"}>
                                                                <div className={"text-3xl text-white font-bold px-12 text-center"}>Meet the developer</div>
                                                            </div>
                                                            <div className="avatar">
                                                                <div className="w-48 mask mask-squircle">
                                                                    <img alt={"headshot"} src={"/images/codeup-final.webp"}/>
                                                                </div>
                                                            </div>
                                                            <div className={"flex w-full flex-col items-end px-8 text-white"}>
                                                                <span className={"text-2xl font-bold"}>Oscar Castro</span>
                                                                <a className={"link link-white hover:text-primary pb-5"} href={"mailto:oscar.a.castro818@gmail.com"}>oscar.a.castro818@gmail.com</a>
                                                                <a aria-label="portfolio" href={"https://oscar-ct.com/"} target="_blank" rel="noopener noreferrer">
                                                                    <CustomBtn customClass={"bg-zinc-700"}>
                                                                        Visit Portfolio
                                                                    </CustomBtn>
                                                                </a>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            </Swiper>
                                        </div>
                                    </div>
                                </Reveal>
                                <div className={"w-full flex flex-col items-center justify-center pb-8"}>
                                    <span className={"text-3xl font-bold py-1"}>Popular Categories</span>
                                    <div className={"w-full flex flex-wrap justify-center"}>
                                    {
                                        productCategories.slice(0, windowInnerWidth >= 768 && windowInnerWidth < 900 ? 4 : windowInnerWidth >= 900 && windowInnerWidth < 1068 ? 5 : windowInnerWidth >= 1068 && windowInnerWidth < 1250 ? 6 : windowInnerWidth >= 1250 && windowInnerWidth < 1420 ? 7 : 8).map(function (product, index) {
                                            return <CategoryItem key={index} product={product} windowInnerWidth={windowInnerWidth}/>
                                        })
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/*DESKTOP*/}
        </div>
    );
};

export default HomePageIntro;