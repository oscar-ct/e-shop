import {useEffect, useState, useRef} from "react";
import {useScroll} from "../hooks/useScroll";
import {motion} from "framer-motion";
import {FaUser, FaChevronDown, FaSearch} from "react-icons/fa";
import {ReactComponent as Logo} from "../icons/e.svg"
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux";
import {useLogoutMutation} from "../slices/usersApiSlice";
import {logout} from "../slices/authSlice";
import {clearCartItems} from "../slices/cartSlice";
import SearchBox from "./SearchBox";
import CartIcon from "./CartIcon";

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

    const documentRef1 = useRef();
    const documentRef2 = useRef();
    const documentRef3 = useRef();
    const documentRef4 = useRef();

    const [searchIsActive, setSearchIsActive] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [openNav, setOpenNav] = useState(false);
    const [productsDropdownActive, setProductsDropdownActive] = useState(false);
    const [userDropdownActive, setUserDropdownActive] = useState(false);
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
    const [smallScreen, setSmallScreen] = useState(window.innerWidth < 500);

    const { scrollDirection, scrollY } = useScroll();

    useEffect(function () {
        const closeUserOpenDropdown = (e) => {
            if (!documentRef1?.current?.contains(e.target)) {
                setUserDropdownActive(false);
            }
        }
        if (userDropdownActive) {
            window.addEventListener('mouseout', closeUserOpenDropdown);
        }
        return () => window.removeEventListener("mouseout", closeUserOpenDropdown);

    }, [userDropdownActive]);

    useEffect(() => {
        const closeProductsOpenDropdown = (e) => {
            if (!documentRef4?.current?.contains(e.target)) {
                setProductsDropdownActive(false);
            }
        }
        if (productsDropdownActive) {
            window.addEventListener('mouseout', closeProductsOpenDropdown);
        }
        return () => window.removeEventListener("mouseout", closeProductsOpenDropdown);
    }, [productsDropdownActive]);

    useEffect(() => {
        const closeMobileNavOnScroll = () => {
            setOpenNav(false);
        }
        if (openNav) {
            window.addEventListener("scroll", closeMobileNavOnScroll);
        }
        return () => window.removeEventListener("scroll", closeMobileNavOnScroll);
    }, [openNav]);
    useEffect(() => {
        const closeMobileNavOnResize = () => {
            window.innerWidth >= 960 && setOpenNav(false);
        }
        if (openNav) {
            window.addEventListener("resize", closeMobileNavOnResize);
        }
        return () => window.removeEventListener("resize", closeMobileNavOnResize);
    }, [openNav])
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!documentRef2?.current?.contains(event.target) && !documentRef3?.current?.contains(event.target)) {
                setOpenNav(false);
            }
        };
        if (openNav) {
            window.addEventListener("click", handleClickOutside);
        }
        return () => window.removeEventListener("click", handleClickOutside);
    }, [openNav]);
    useEffect(function () {
        const adjustSmallScreen = () => {
            if (windowInnerWidth > 500) {
                setSmallScreen(false);
            } else {
                setSmallScreen(true);
            }
        }
        adjustSmallScreen();
    }, [windowInnerWidth])
    useEffect(function () {
        const setInnerWidth = () => {
            setWindowInnerWidth(window.innerWidth);
        };
        window.addEventListener("resize", setInnerWidth);
        return () => {
            window.removeEventListener("resize", setInnerWidth)
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
            navigate(`/search/${keyword}`);
            setKeyword("");
        }
    }
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
    const styles = {
        active: {
            // visibility: "visible",
            transition: "all 0.5s"
        },
        hidden: {
            // visibility: "hidden",
            transition: "all 0.5s",
            transform: "translateY(-100%)"
        },
        hidden2: {
            // visibility: "hidden",
            transition: "all 0.5s",
            transform: "translateX(-100%)"
        }
    };

    return (
        <>
            <nav
                className={`${(scrollY < 50 || scrollDirection === "up") || (scrollDirection === "down" &&  scrollY < 50 && smallScreen) ? `translate-y-0 sticky visible transition-all duration-700 ` : smallScreen ? "sticky invisible duration-700 transition-all translate-y-[-100%]": "visible sticky" } inset-0 z-20 block h-max w-full rounded-none py-0 liner-gradient bg-black md:bg-black/90 text-white`}
                // className={`sticky inset-0 z-10 block h-max w-full max-w-full rounded-none py-4 shadow-xl backdrop-blur-lg`}
                 // style={(scrollY < 25 || scrollDirection === "up" || (scrollDirection === "down" && scrollY < 25)) ? styles.active: styles.hidden}
            >
                <div className="px-2 flex justify-between items-center">
                    <button aria-label="menu" ref={documentRef2} className="middle none relative mr-auto h-6 max-h-[40px] w-6 max-w-[40px] rounded-lg text-center uppercase transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none md:hidden" onClick={() => setOpenNav(!openNav)}>

                        {openNav ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-7 w-8" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"/>
                            </svg>
                        )}
                    </button>
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
                    <div className={"justify-end flex"}>
                        <div className={"flex justify-end"}>
                            <div className="ml-auto hidden items-center gap-1 lg:gap-2 md:flex">
                                <SearchBox/>
                                <div className="flex-none">
                                    <CartIcon isValidShippingAddress={Object.keys(shippingAddress).length !== 0} isValidPaymentMethod={paymentMethod !== null} cartItems={cartItems} totalCartItems={totalCartItems} subtotalPrice={subtotalPrice}/>
                                </div>

                                <div ref={documentRef4} className="relative inline-block text-left py-4">
                                    <div
                                        onMouseEnter={() => setProductsDropdownActive(prevState => !prevState)}
                                        className={"cursor-pointer btn btn-ghost normal-case flex items-center"}
                                    >
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
                                        <div ref={documentRef1} className="relative inline-block text-left py-4">
                                            <div
                                                onMouseEnter={() => setUserDropdownActive(prevState => !prevState)}
                                                className={"cursor-pointer btn btn-ghost normal-case flex items-center"}
                                                >
                                                    <span>{userData.name}</span>
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
                                        <Link to={"/login"}>
                                            <div
                                                className="flex items-center cursor-pointer btn btn-ghost normal-case"
                                            >
                                                <FaUser/>
                                                <span>Login</span>
                                            </div>
                                        </Link>
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

                    <div className={"md:hidden flex justify-center items-center w-full"}>
                        {
                            searchIsActive ? (
                                <div className={"w-full flex justify-end "}>
                                    <div className={"py-2 w-min "}>
                                        <input
                                            autoFocus
                                            autoComplete={"off"} className="animate-slide-in-right px-4 bg-white/90 h-10 rounded-full text-[16px] md:text-sm focus:outline-none"
                                            type="search" name="search" placeholder="Search all products" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                            submitSearch();
                                            setSearchIsActive(prevState => !prevState)
                                            }
                                        }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className={"pl-12 py-3 flex w-full justify-center items-end"}>
                                    <button className={"animate-slide-in-left"} onClick={() => navigate("/")}>
                                        <Logo className={"w-8 "} fill={"white"}/>
                                    </button>
                                </div>
                            )
                        }

                        <div className={"flex items-center"}>
                            <button
                                className={"btn btn-ghost pr-2"}
                                onClick={() => {
                                    submitSearch();
                                    setSearchIsActive(prevState => !prevState);
                                }}
                            >
                                <FaSearch className={searchIsActive && "animate-bounce"} />
                            </button>
                            <CartIcon isValidShippingAddress={Object.keys(shippingAddress).length !== 0} isValidPaymentMethod={paymentMethod !== null} cartItems={cartItems} totalCartItems={totalCartItems} subtotalPrice={subtotalPrice} />
                        </div>
                    </div>
                </div>


            </nav>
            {/*/////// mobile nav ///////*/}
            <nav>
                <div ref={documentRef3} className={`z-20 bg-white/50 backdrop-blur-2xl fixed left-0 w-full py-6 md:hidden h-screen`} style={openNav ? styles.active : styles.hidden2}>
                    <div className={"flex flex-col justify-start h-full w-full"}>
                        <ul className="flex flex-col text-white font-bold text-xl">
                            <li className="flex items-center py-2 font-normal antialiased hover:subpixel-antialiased px-8">
                                <Link onClick={() => setOpenNav(!openNav)} to={"/"} className={"cursor-pointer text-3xl font-bold text-neutral flex items-center normal-case"}>
                                   Home
                                </Link>
                            </li>
                            <li className="flex items-center py-4 px-2 font-normal antialiased hover:subpixel-antialiased px-8">
                                <Link onClick={() => setOpenNav(!openNav)} to={latestProductsLink} className={"cursor-pointer text-3xl font-bold text-neutral flex items-center normal-case"}>
                                    Latest Products
                                </Link>
                            </li>
                            <li className="flex items-center py-2 font-normal antialiased hover:subpixel-antialiased px-8">
                                <Link onClick={() => setOpenNav(!openNav)} to={topRatedLink} className={"cursor-pointer text-3xl font-bold text-neutral flex items-center normal-case"}>
                                    Top Rated Products
                                </Link>
                            </li>
                            {
                                userData && (
                                    <>
                                        <li className="flex items-center py-2 font-normal antialiased hover:subpixel-antialiased px-8">
                                            <Link onClick={() => setOpenNav(!openNav)} to={myAccountLink} className="cursor-pointer text-3xl font-bold text-neutral flex items-center normal-case">
                                                My Account
                                            </Link>
                                        </li>
                                        <li className="flex items-center py-2 font-normal antialiased hover:subpixel-antialiased px-8">
                                            <Link onClick={() => setOpenNav(!openNav)} to={myOrdersLink} className={"cursor-pointer text-3xl font-bold text-neutral flex items-center normal-case"}>
                                                My Orders
                                            </Link>
                                        </li>
                                    </>
                                )
                            }
                            {
                                userData?.isAdmin && (
                                    <>
                                        <li className="flex items-center py-2 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                            <Link onClick={() => setOpenNav(!openNav)} to={adminOrdersLink} className={"cursor-pointer text-3xl font-bold text-neutral flex items-center normal-case"}>
                                                Admin Dashboard
                                            </Link>
                                        </li>
                                    </>
                                )
                            }
                            {
                                userData ? (
                                    <li onClick={() => setOpenNav(!openNav)} className="flex items-center py-2 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                        <button className={"cursor-pointer text-3xl font-bold text-red-500 flex items-center normal-case"} onClick={logoutHandler}>
                                            Logout
                                        </button>
                                    </li>
                                ) : (
                                    <li className="flex items-center py-2 font-normal antialiased hover:subpixel-antialiased px-8">
                                        <Link onClick={() => setOpenNav(!openNav)} to={"/login"} className="cursor-pointer text-3xl font-bold text-neutral flex items-center normal-case">
                                            Login
                                        </Link>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </nav>
            {/*/////// mobile nav ///////*/}
        </>
    );
};

export default Navbar;