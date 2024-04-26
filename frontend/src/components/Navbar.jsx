import {useEffect, useState} from "react";
import {useScroll} from "../hooks/useScroll";
import {AnimatePresence, motion, useAnimation} from "framer-motion";
import {FaUser, FaChevronDown, FaSearch} from "react-icons/fa";
import {ReactComponent as Logo} from "../icons/e.svg"
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux";
import {useLogoutMutation} from "../slices/usersApiSlice";
import {logout} from "../slices/authSlice";
import {clearCartItems} from "../slices/cartSlice";
import SearchBox from "./SearchBox";
import CartIcon from "./CartIcon";
import Reveal from "./Reveal";

const Navbar = () => {
    const {cartItems, shippingAddress, paymentMethod} = useSelector(function (state) {
        return state.cart;
    });
    const {userData} = useSelector(function (state) {
        return state.auth;
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const [searchIsActive, setSearchIsActive] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [openNav, setOpenNav] = useState(false);
    const [productsDropdownActive, setProductsDropdownActive] = useState(false);
    const [userDropdownActive, setUserDropdownActive] = useState(false);
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
    const [smallScreen, setSmallScreen] = useState(window.innerWidth < 500);
    const [navGradient, setNavGradient]= useState("");
    const [shake, setShake] = useState(false);

    const { scrollDirection, scrollY } = useScroll();

    // useEffect(function () {
    //     const closeUserOpenDropdown = (e) => {
    //         if (!documentRef1?.current?.contains(e.target)) {
    //             setUserDropdownActive(false);
    //         }
    //     }
    //     if (userDropdownActive) {
    //         window.addEventListener('mouseout', closeUserOpenDropdown);
    //     }
    //     return () => window.removeEventListener("mouseout", closeUserOpenDropdown);
    //
    // }, [userDropdownActive]);
    // useEffect(() => {
    //     const closeProductsOpenDropdown = (e) => {
    //         if (!documentRef4?.current?.contains(e.target)) {
    //             setProductsDropdownActive(false);
    //         }
    //     }
    //     if (productsDropdownActive) {
    //         window.addEventListener('mouseout', closeProductsOpenDropdown);
    //     }
    //     return () => window.removeEventListener("mouseout", closeProductsOpenDropdown);
    // }, [productsDropdownActive]);

    // useEffect(() => {
    //     const closeMobileNavOnScroll = () => {
    //         setOpenNav(false);
    //     }
    //     if (openNav) {
    //         window.addEventListener("scroll", closeMobileNavOnScroll);
    //     }
    //     return () => window.removeEventListener("scroll", closeMobileNavOnScroll);
    // }, [openNav]);
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (!documentRef2?.current?.contains(event.target) && !documentRef3?.current?.contains(event.target)) {
    //             setOpenNav(false);
    //         }
    //     };
    //     if (openNav) {
    //         window.addEventListener("click", handleClickOutside);
    //     }
    //     return () => window.removeEventListener("click", handleClickOutside);
    // }, [openNav]);


    useEffect(() => {
        const closeMobileNavOnResize = () => {
            if (window.innerWidth >= 768 && openNav) {
                setOpenNav(false);
            }
            if (window.innerWidth >= 768 && searchIsActive) {
                setSearchIsActive(false);
            }
        }
        window.addEventListener("resize", closeMobileNavOnResize);
        return () => window.removeEventListener("resize", closeMobileNavOnResize);
    }, [openNav, searchIsActive]);

    useEffect(function () {
        const adjustSmallScreen = () => {
            if (windowInnerWidth > 500) {
                setNavGradient("nav-liner-gradient");
                setSmallScreen(false);
            } else {
                setNavGradient("");
                setSmallScreen(true);
            }
        }
        adjustSmallScreen();
    }, [windowInnerWidth]);
    useEffect(function () {
        const setInnerWindowWidth = () => {
            setWindowInnerWidth(window.innerWidth);
        };
        window.addEventListener("resize", setInnerWindowWidth);
        return () => {
            window.removeEventListener("resize", setInnerWindowWidth)
        }
    }, []);


    const rotateChevron = (action) => {
       return action ? "open" : "closed";
    };
    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            navigate("/login");
            dispatch(clearCartItems());
            dispatch(logout());
            setUserDropdownActive(false);
        } catch (e) {
            console.log(e)
        }
    };
    const submitSearch = () => {
        if (keyword.trim()) {
            setKeyword("");
            setSearchIsActive(false);
            navigate(`/search/${keyword}`);
        } else {
            if (!shake) {
                setShake(true);
                setTimeout(function () {
                    setShake(false);
                }, 500);
            }
        }
    };
    const totalCartItems = cartItems?.reduce(function (acc, item) {
        return acc + item.quantity
    }, 0);
    const subtotalPrice =  cartItems?.reduce(function (acc, product) {
        return acc + product.quantity * product.price;
    }, 0).toFixed(2);
    const adminOrdersLink = "/admin/orders";
    const myOrdersLink = "/profile/orders";
    const myAccountLink = "/profile/account";
    const topRatedLink = "/sort/toprated/select/all";
    const latestProductsLink = "/sort/latest/select/all";

    const mainControls = useAnimation();

    useEffect(() => {
        if (openNav) {
            mainControls.start("visibleNav")
        } else {
            mainControls.start("hiddenNav")
        }
        if (searchIsActive) {
            mainControls.start("visibleSearch")
        } else {
            mainControls.start("hiddenSearch")
        }
    }, [mainControls, openNav, searchIsActive]);

    return (
        <>
            <nav
                className={`${(scrollY < 50 || scrollDirection === "up") || (scrollDirection === "down" &&  scrollY < 50 && smallScreen) ? `translate-y-0 visible transition-all duration-700` : !openNav && smallScreen ? "invisible duration-700 transition-all translate-y-[-100%]": "visible" } fixed inset-0 z-30 block h-max w-full rounded-none py-0 ${navGradient} bg-white/70 backdrop-blur-lg dark:bg-black md:bg-black text-black md:text-white dark:text-white`}
                // className={`sticky inset-0 z-10 block h-max w-full max-w-full rounded-none py-4 shadow-xl backdrop-blur-lg`}
                 // style={(scrollY < 25 || scrollDirection === "up" || (scrollDirection === "down" && scrollY < 25)) ? styles.active: styles.hidden}
            >
                <div className="px-2 flex justify-between items-center">


                    {/*e LOGO ON DESKTOP NAVBAR*/}
                    <div className={"hidden md:flex md:items-center cursor-pointer rounded-xl py-2 px-3"}>
                        <motion.div
                            onClick={() => navigate("/")}
                            className={"text-xl flex items-center"}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 1.0 }}
                        >
                            <Logo className={"w-6 mr-1"} fill={"white"}/>
                        </motion.div>
                    </div>

                    {/*DESKTOP NAVBAR*/}
                    <div className={"hidden md:flex justify-end"}>
                        <div className={"flex justify-end"}>
                            <div className="ml-auto flex items-center gap-1 lg:gap-2">
                                <SearchBox/>
                                <div className="flex-none">
                                    <CartIcon isValidShippingAddress={Object.keys(shippingAddress).length !== 0} isValidPaymentMethod={paymentMethod !== null} cartItems={cartItems} totalCartItems={totalCartItems} subtotalPrice={subtotalPrice}/>
                                </div>

                                <div
                                    className="relative inline-block text-left py-4"
                                    onMouseEnter={() => setProductsDropdownActive(true)}
                                    onMouseLeave={() => setProductsDropdownActive(false)}>
                                    <div className={"cursor-pointer btn btn-ghost normal-case flex items-center"}>
                                        <span>Shop</span>
                                        <div className={`${rotateChevron(productsDropdownActive)}`}>
                                            <FaChevronDown/>
                                        </div>

                                    </div>
                                    {
                                        productsDropdownActive && (
                                            <div className="absolute right-0 z-10 mt-4 origin-top-right">
                                                <div className="menu p-0 bg-neutral/70 rounded-b-md text-white font-bold flex flex-col justify-between w-full">
                                                    <div className={"flex-col w-full"}>
                                                        <Link to={latestProductsLink} className={"block px-10 py-5 hover:bg-neutral/70"}>
                                                            <span className={"w-full text-xl text-white whitespace-nowrap"}>Latest Products</span>
                                                        </Link>
                                                        <Link to={topRatedLink} className={"block px-10 py-5 hover:bg-neutral/70"}>
                                                            <span className={"w-full text-xl text-white whitespace-nowrap"}>Top Rated</span>
                                                        </Link>
                                                        <Link to={latestProductsLink} className={"block px-10 py-5 rounded-b-md  hover:bg-neutral/70"}>
                                                            <span className={"w-full text-xl text-white whitespace-nowrap"}>All Categories</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    userData ? (
                                        <div
                                            className="relative inline-block text-left py-4"
                                            onMouseEnter={() => setUserDropdownActive(true)}
                                            onMouseLeave={() => setUserDropdownActive(false)}
                                            >
                                            <div className={"cursor-pointer btn btn-ghost normal-case flex items-center"}>
                                                <span>{userData.name.substring(0, 32)}</span>
                                                <div className={`${rotateChevron(userDropdownActive)}`}>
                                                    <FaChevronDown/>
                                                </div>
                                            </div>
                                            {
                                                userDropdownActive && (
                                                    <div className="absolute right-0 z-10 mt-4 origin-top-right">
                                                        <div className="menu p-0 bg-neutral/70 rounded-b-md text-white font-bold flex flex-col justify-between w-full">
                                                            <div className={"flex-col w-full"}>
                                                                <Link to={myAccountLink} className={"block px-10 py-5 hover:bg-neutral/70"}>
                                                                    <span className={"w-full text-xl text-white whitespace-nowrap"}>Account</span>
                                                                </Link>
                                                                <Link to={myOrdersLink} className={"block px-10 py-5 hover:bg-neutral/70"}>
                                                                    <span className={"w-full text-xl text-white whitespace-nowrap"}>My Orders</span>
                                                                </Link>
                                                                <Link to={"/locator"} className={"flex px-10 py-5 hover:bg-neutral/70"}>
                                                                    <span className={"w-full text-xl text-white whitespace-nowrap pr-2"}>Order Lookup</span>
                                                                    <FaSearch/>
                                                                </Link>
                                                                <button onClick={logoutHandler} className={"w-full text-start block px-10 py-5 rounded-b-md hover:bg-neutral/70"}>
                                                                    <span className={"w-full text-xl text-white whitespace-nowrap"} >Logout</span>
                                                                </button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (

                                        <div
                                            className="relative inline-block text-left py-4"
                                            onMouseEnter={() => setUserDropdownActive(true)}
                                            onMouseLeave={() => setUserDropdownActive(false)}
                                        >

                                            <div className={"cursor-pointer btn btn-ghost normal-case flex items-center"}>
                                                <Link to={"/login"}>
                                                    <div
                                                        className="flex items-center"
                                                    >
                                                        <FaUser/>
                                                        <span className={"pl-2"}>Login</span>
                                                    </div>
                                                </Link>
                                                <div className={`${rotateChevron(userDropdownActive)}`}>
                                                    <FaChevronDown/>
                                                </div>
                                            </div>
                                            {
                                                userDropdownActive && (
                                                    <div className="absolute right-0 z-10 mt-4 origin-top-right">
                                                        <div className="menu p-0 bg-neutral/70 rounded-b-md text-white font-bold flex flex-col justify-between w-full">
                                                            <div className={"flex-col w-full"}>
                                                                <Link to={"/register"} className={"block px-10 py-5 hover:bg-neutral/70"}>
                                                                    <span className={"w-full text-xl text-white whitespace-nowrap"}>Sign Up</span>
                                                                </Link>
                                                                <Link to={"/locator"} className={"flex items-center px-10 py-5 rounded-b-md hover:bg-neutral/70"}>
                                                                    <span className={"w-full text-xl text-white whitespace-nowrap pr-2"}>Order Lookup</span>
                                                                    <FaSearch className={""}/>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                {
                                    userData?.isAdmin && (

                                        <div className="relative inline-block text-left">
                                            <div
                                                onClick={() => navigate(adminOrdersLink)}
                                                className={"cursor-pointer btn rounded-full btn-secondary normal-case flex items-center"}
                                            >
                                                <div className={"flex flex-col"}>
                                                    <span>Admin</span>
                                                    <span>Dashboard</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>


                    {/*MOBILE NAVBAR*/}
                    <div className={"md:hidden flex justify-between items-center w-full"}>
                        <div className={"flex items-center w-full"}>
                            <button className={"btn btn-ghost pl-1"} onClick={() => navigate("/")}>
                                <Logo className={"w-4 text-black dark:text-white"} fill={"currentColor"}/>
                            </button>

                            {/*MD SCREEN NAV*/}
                            <div className={"hidden sm:flex justify-between w-full md:hidden text-xs"}>
                                <Link to={topRatedLink} className={"antialiased hover:subpixel-antialiased"}>
                                    Top Rated
                                </Link>
                                <Link to={latestProductsLink} className={"antialiased hover:subpixel-antialiased"}>
                                    All Products
                                </Link>
                                <Link to={"/locator"} className={"flex items-center"}>
                                    <button className={"antialiased hover:subpixel-antialiased pr-1"}>
                                        Order Lookup
                                    </button>
                                    <FaSearch className={"pl-[2px]"}/>
                                </Link>
                                {
                                    userData ? (
                                        <>
                                            <Link to={myAccountLink} className={"antialiased hover:subpixel-antialiased"}>
                                                My Account
                                            </Link>
                                            <Link to={myOrdersLink} className={"antialiased hover:subpixel-antialiased"}>
                                                My Orders
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to={"/login"} className={"antialiased hover:subpixel-antialiased"}>
                                                Login
                                            </Link>
                                            <Link to={"/register"} className={"antialiased hover:subpixel-antialiased"}>
                                                Sign Up
                                            </Link>
                                        </>
                                    )
                                }
                                {
                                    userData?.isAdmin && (
                                        <Link to={adminOrdersLink} className={"antialiased hover:subpixel-antialiased"}>
                                            Admin
                                        </Link>
                                    )
                                }

                                {
                                    userData && (
                                        <button onClick={logoutHandler} className={"antialiased hover:subpixel-antialiased"}>
                                            Logout
                                        </button>
                                    )
                                }
                            </div>
                            {/*MD SCREEN NAV*/}

                        </div>
                        <div className={"flex items-center"}>
                            <button
                                className={"btn btn-ghost pr-2"}
                                onClick={() => {
                                    setSearchIsActive(true);
                                }}
                            >
                                <FaSearch/>
                            </button>
                            <CartIcon onClick={() => setOpenNav(false)} isValidShippingAddress={Object.keys(shippingAddress).length !== 0} isValidPaymentMethod={paymentMethod !== null} cartItems={cartItems} totalCartItems={totalCartItems} subtotalPrice={subtotalPrice}/>

                            {/*HAMBURGER MENU FOR MOBILE NAVBAR*/}
                            <button aria-label="menu" className="sm:hidden middle pl-2 none relative mr-auto transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={() => setOpenNav(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>


            {/*/////// search dropdown ///////*/}

            <div className={"md:hidden"}>
                <AnimatePresence>
                    <motion.div
                        className={`z-30 bg-white/80 dark:bg-black/80 backdrop-blur-lg fixed top-0 w-full pt-3 h-screen`}
                        variants={{
                            hiddenSearch: { opacity: 0, y: "calc(-100% - 58px)"},
                            visibleSearch: {opacity: 1, y: 0},
                        }}
                        initial={"hidden"}
                        animate={mainControls}
                        transition={{
                            ease: "linear",
                            duration: .25,
                            delay: 0.00
                        }}
                    >
                        <Reveal once={false} y={-50}>
                            <div className={"px-2 flex justify-end"}>
                                <button className={"text-black dark:text-white"} onClick={() => setSearchIsActive(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </Reveal>
                        <div className={"flex flex-col justify-start h-full w-full"}>
                            <ul className="flex flex-col font-bold text-xl">
                                <li className="pt-8 px-8">
                                    <Reveal once={false} y={-50}>
                                        <div style={shake === true ? {animation: "shake 0.5s", animationIterationCount: ".5"} : {}} className={"flex items-center gap-4 w-full"}>
                                            <FaSearch className={"cursor-pointer text-black dark:text-white"} fill={"currentColor"} onClick={submitSearch}/>
                                            <input
                                                type={"search"}
                                                autoComplete={"off"}
                                                value={keyword}
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        submitSearch();
                                                    }
                                                }}
                                                onChange={(e) => setKeyword(e.target.value)}
                                                className={"w-full focus:outline-none bg-transparent text-3xl font-bold text-black dark:text-white"}
                                                placeholder={"Search products"}
                                            />
                                        </div>
                                    </Reveal>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>


            {/*/////// mobile nav dropdown ///////*/}
            <nav>
                <AnimatePresence>
                    <motion.div
                        className={`sm:hidden z-30 bg-white/80 dark:bg-black/80 backdrop-blur-lg fixed top-0 w-full pt-3 h-screen`}
                        variants={{
                            hiddenNav: { opacity: 0, y: "calc(-100% - 58px)"},
                            visibleNav: {opacity: 1, y: 0},
                        }}
                        initial={"hidden"}
                        animate={mainControls}
                        transition={{
                            ease: "linear",
                            duration: .25,
                            delay: 0.00
                        }}
                    >
                        <Reveal once={false} y={-50}>
                            <div className={"px-2 flex justify-end"}>
                                <button className={"text-black dark:text-white"} onClick={() => setOpenNav(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </Reveal>
                        <div className={"flex flex-col justify-start h-full w-full"}>
                            <ul className="flex flex-col text-neutral dark:text-white font-bold text-xl">
                                <li className="pb-2 px-8">
                                   <Reveal once={false} y={-50}>
                                    <Link onClick={() => setOpenNav(!openNav)} to={"/"} className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
                                       Home
                                    </Link>
                                   </Reveal>
                                </li>
                                <li className="py-2 px-8">
                                    <Reveal once={false} y={-50} delay={0.15}>
                                    <Link onClick={() => setOpenNav(!openNav)} to={latestProductsLink} className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
                                        All Products
                                    </Link>
                                    </Reveal>
                                </li>
                                <li className="py-2 px-8">
                                    <Reveal once={false} y={-50} delay={0.20}>
                                    <Link onClick={() => setOpenNav(!openNav)} to={topRatedLink} className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
                                        Top Rated Products
                                    </Link>
                                    </Reveal>
                                </li>
                                <li className="py-2 px-8">
                                    <Reveal once={false} y={-50} delay={0.25}>
                                        <div className={"flex items-center"}>
                                            <Link onClick={() => setOpenNav(!openNav)} to={"/locator"} className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case pr-3 antialiased hover:subpixel-antialiased"}>
                                                Order Lookup
                                            </Link>
                                            <FaSearch/>
                                        </div>
                                    </Reveal>
                                </li>
                                {
                                    userData && (
                                        <>
                                            <li className="py-2 px-8">
                                                <Reveal once={false} y={-50} delay={0.30}>
                                                <Link onClick={() => setOpenNav(!openNav)} to={myAccountLink} className="w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased">
                                                    My Account
                                                </Link>
                                                </Reveal>
                                            </li>
                                            <li className="py-2 px-8">
                                                <Reveal once={false} y={-50} delay={0.35}>
                                                <Link onClick={() => setOpenNav(!openNav)} to={myOrdersLink} className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
                                                    My Orders
                                                </Link>
                                                </Reveal>
                                            </li>
                                        </>
                                    )
                                }
                                {
                                    userData?.isAdmin && (
                                        <>
                                            <li className="py-2 px-8">
                                                <Reveal once={false} y={-50} delay={0.35}>
                                                <Link onClick={() => setOpenNav(!openNav)} to={adminOrdersLink} className={"w-fit cursor-pointer text-3xl font-bold text-secondary flex items-center normal-case antialiased hover:subpixel-antialiased"}>
                                                    Admin Dashboard
                                                </Link>
                                                </Reveal>
                                            </li>
                                        </>
                                    )
                                }
                                {
                                    userData ? (
                                        <li onClick={() => setOpenNav(!openNav)} className="py-2 px-8">
                                            <Reveal once={false} y={-50} delay={0.40}>
                                            <button className={"w-fit cursor-pointer text-3xl font-bold text-red-500 flex items-center normal-case antialiased hover:subpixel-antialiased"} onClick={logoutHandler}>
                                                Logout
                                            </button>
                                            </Reveal>
                                        </li>
                                    ) : (
                                        <>
                                            <li className="py-2 px-8">
                                                <Reveal once={false} y={-50} delay={0.30}>
                                                <Link onClick={() => setOpenNav(!openNav)} to={"/login"} className="w-fit cursor-pointer text-3xl font-bold text-info flex items-center normal-case antialiased hover:subpixel-antialiased">
                                                    Login
                                                </Link>
                                                </Reveal>
                                            </li>
                                            <li className="py-2 px-8">
                                                <Reveal once={false} y={-50} delay={0.30}>
                                                    <Link onClick={() => setOpenNav(!openNav)} to={"/register"} className="cursor-pointer text-3xl font-bold text-primary flex items-center normal-case antialiased hover:subpixel-antialiased">
                                                        Sign up
                                                    </Link>
                                                </Reveal>
                                            </li>
                                        </>

                                    )
                                }
                            </ul>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </nav>
            {/*/////// mobile nav ///////*/}
        </>
    );
};

export default Navbar;