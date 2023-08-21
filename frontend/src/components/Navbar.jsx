import {useEffect, useState, useRef} from "react";
import {useScroll} from "../hooks/useScroll";
import {motion} from "framer-motion";
import {FaUser, FaChevronDown} from "react-icons/fa";
import {ReactComponent as Logo} from "../icons/e.svg"
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux";
import {useLogoutMutation} from "../slices/usersApiSlice";
import {logout} from "../slices/authSlice";
import {clearCartItems} from "../slices/cartSlice";
import SearchBox from "./SearchBox";
import CartIcon from "./CartIcon";

const Navbar = () => {
    const {cartItems} = useSelector(function (state) {
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
    const [openNav, setOpenNav] = useState(false);
    const [dropdownActive, setDropdownActive] = useState(false);
    const { scrollDirection } = useScroll();


    useEffect(function () {
        const closeOpenDropdown = (e) => {
            if (!documentRef1?.current?.contains(e.target)) {
                setDropdownActive(false);
            }
        }
        if (dropdownActive) {
            window.addEventListener('mousedown', closeOpenDropdown);
        }
        return () => window.removeEventListener("mousedown", closeOpenDropdown);
    }, [dropdownActive]);
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

    const rotateChevron = (action) => {
       return action ? "open" : "closed";
    }
    const totalCartItems = cartItems?.reduce(function (acc, item) {
            return acc + item.quantity
        }, 0);
    const subtotalPrice =  cartItems?.reduce(function (acc, product) {
        return acc + product.quantity * product.price;
    }, 0).toFixed(2);
    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            navigate("/login");
            dispatch(clearCartItems());
            dispatch(logout());
            setDropdownActive(false);
        } catch (e) {
            console.log(e)
        }
    }
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
    const [windowScrollY, setWindowScrollY] = useState(window.scrollY);

    useEffect(function () {
        const setInnerWidth = () => {
           setWindowInnerWidth(window.innerWidth);
        };
        window.addEventListener("resize", setInnerWidth);
        return () => {
            window.removeEventListener("resize", setInnerWidth)
        }
    }, []);

    useEffect(function () {
        const setScrollY = () => {
            if (windowInnerWidth <= 500) {
                setWindowScrollY(window.scrollY);
            }
        };
        window.addEventListener("scroll", setScrollY);
        return () => {
            window.removeEventListener("scroll", setScrollY)
        }
    }, [windowInnerWidth]);


    return (
        <>
            <nav
                className={`${windowInnerWidth > 500 || scrollDirection === "neutral" ? "sticky" : windowScrollY < 50 || scrollDirection === "up" || (scrollDirection === "down" &&  windowScrollY < 50) ? "translate-y-0 sticky visible transition-all duration-700" : "sticky visible duration-700 transition-all translate-y-[-100%]" } inset-0 z-10 block h-max w-full max-w-full rounded-none py-4 shadow-md backdrop-blur-lg`}
                // className={`sticky inset-0 z-10 block h-max w-full max-w-full rounded-none py-4 shadow-xl backdrop-blur-lg`}
                 // style={(scrollY < 25 || scrollDirection === "up" || (scrollDirection === "down" && scrollY < 25)) ? styles.active: styles.hidden}
            >
                <div className="px-2 sm:px-5 flex justify-between items-center">
                    <div className={"hidden lg:flex lg:items-center cursor-pointer rounded-xl py-2 px-3"}>
                        <motion.div
                            onClick={() => navigate("/")}
                            className={"text-xl flex items-center"}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 1.0 }}
                        >
                            <Logo className={"w-6 mr-1"} fill={"black"}/>
                            {/*<button*/}
                            {/*    style={{fontFamily: 'Moirai One, cursive', fontSize: "40px"}}*/}
                            {/*>*/}
                            {/*    shop*/}
                            {/*</button>*/}
                        </motion.div>
                    </div>
                    <div className={"justify-end flex"}>
                        <div className={"flex justify-end"}>
                            <div className="ml-auto hidden items-center gap-2 lg:flex">
                                <SearchBox/>
                                <div className="flex-none">
                                    <CartIcon cartItems={cartItems} totalCartItems={totalCartItems} subtotalPrice={subtotalPrice}/>
                                </div>
                                {
                                    userData ? (
                                        <div ref={documentRef1} className="relative inline-block text-left">
                                            <div>
                                                <div
                                                    onClick={() => setDropdownActive(prevState => !prevState)}
                                                    className={"cursor-pointer btn btn-ghost normal-case flex items-center"}
                                                    >
                                                        <span>
                                                            {userData.name}
                                                        </span>
                                                        <div className={`${rotateChevron(dropdownActive)}`}>
                                                            <FaChevronDown/>
                                                        </div>

                                                </div>
                                            </div>

                                            {
                                                dropdownActive && (
                                                    <div className="absolute right-0 z-10 mt-2 origin-top-right">
                                                        <div className="menu bg-neutral/70 rounded-box text-white font-bold flex flex-col justify-between w-full">
                                                            <div className={"flex w-full"}>
                                                                {
                                                                    userData.isAdmin && (
                                                                        <div className={"w-6/12"}>
                                                                            <div className={"p-1"}>
                                                                                <Link to={"/admin/orders"} className={"btn btn-info normal-case w-full whitespace-nowrap"}>
                                                                                    Order List
                                                                                </Link>
                                                                            </div>
                                                                            <div className={"p-1"}>
                                                                                <Link to={"/admin/users"} className={"btn btn-info normal-case w-full whitespace-nowrap"}>
                                                                                    User List
                                                                                </Link>
                                                                            </div>
                                                                            <div className={"p-1"}>
                                                                                <Link to={"/admin/products"} className={"btn btn-info normal-case w-full whitespace-nowrap"}>
                                                                                    Product List
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                <div className={`${userData.isAdmin ? "w-6/12" : "w-full"}`}>
                                                                    <div className={"p-1"}>
                                                                        <Link to={"/profile/account"} className={"btn btn-neutral normal-case w-full whitespace-nowrap"}>
                                                                            Account
                                                                        </Link>
                                                                    </div>
                                                                    <div className={"p-1"}>
                                                                        <Link to={"/profile/orders"} className={"btn btn-neutral normal-case w-full whitespace-nowrap"}>
                                                                            My Orders
                                                                        </Link>
                                                                    </div>
                                                                    <div className={"p-1"}>
                                                                        <button className={"btn btn-error normal-case w-full"} onClick={logoutHandler}>
                                                                            Logout
                                                                        </button>
                                                                    </div>

                                                                </div>
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
                                                <span>
                                                    Login
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <button ref={documentRef2} className="middle none relative mr-auto h-6 max-h-[40px] w-6 max-w-[40px] rounded-lg text-center uppercase transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden" onClick={() => setOpenNav(!openNav)}>

                        {openNav ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-7 w-7" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"/>
                            </svg>
                        )}
                    </button>
                    <div className={"lg:hidden flex items-center"}>
                        <div className={"py-1"}>
                            <SearchBox/>
                        </div>
                        <div>
                            <CartIcon cartItems={cartItems} totalCartItems={totalCartItems} subtotalPrice={subtotalPrice} />
                        </div>
                    </div>
                </div>

            </nav>
            {/*/////// mobile nav ///////*/}
            <nav>
                <div ref={documentRef3} className={`z-10 backdrop-blur-lg shadow-2xl fixed top-[5rem] left-0 w-7/12 md:w-6/12 py-6  lg:hidden h-[calc(100vh-80px)]`} style={openNav ? styles.active : styles.hidden2}>
                    <div className={"flex flex-col justify-start h-full w-full"}>
                        <ul className="flex flex-col text-white font-bold text-xl">
                            <li onClick={() => setOpenNav(!openNav)} className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                <Link to={"/"} className={"rounded-xl btn btn-neutral normal-case w-full whitespace-nowrap"}>
                                    <Logo className={"w-5"} fill={"white"}/>
                                </Link>
                            </li>
                            <li onClick={() => setOpenNav(!openNav)} className="sm:hidden flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                <Link to={"/cart"} className="rounded-xl btn btn-neutral normal-case w-full whitespace-nowrap">
                                    <div className="indicator">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        {
                                            cartItems.length !== 0 && (
                                                <span className="badge text-white bg-primary badge-sm indicator-item">{totalCartItems}</span>
                                            )
                                        }

                                    </div>
                                    <span className={"normal-case"}/>
                                </Link>
                            </li>
                            {
                                userData && (
                                    <>
                                        <li onClick={() => setOpenNav(!openNav)} className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                            <Link to={"/profile/account"} className={"rounded-xl btn btn-neutral normal-case w-full whitespace-nowrap"}>
                                                Account
                                            </Link>
                                        </li>
                                        <li onClick={() => setOpenNav(!openNav)} className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                            <Link to={"/profile/orders"} className={"rounded-xl btn btn-neutral normal-case w-full whitespace-nowrap"}>
                                                My Orders
                                            </Link>
                                        </li>
                                    </>
                                )
                            }

                            {
                                userData?.isAdmin && (
                                    <>
                                        <li onClick={() => setOpenNav(!openNav)} className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                            <Link to={"/admin/orders"} className={"rounded-xl btn btn-info normal-case w-full whitespace-nowrap"}>
                                                Order List
                                            </Link>
                                        </li>
                                        <li onClick={() => setOpenNav(!openNav)} className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                            <Link to={"/admin/users"} className={"rounded-xl btn btn-info normal-case w-full whitespace-nowrap"}>
                                                User List
                                            </Link>
                                        </li>
                                        <li onClick={() => setOpenNav(!openNav)} className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                            <Link to={"/admin/products"} className={"rounded-xl btn btn-info normal-case w-full whitespace-nowrap"}>
                                                Product List
                                            </Link>
                                        </li>
                                    </>
                                )
                            }

                            {
                                userData ? (
                                    <li onClick={() => setOpenNav(!openNav)} className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                        <button className={"rounded-xl btn btn-error normal-case w-full"} onClick={logoutHandler}>
                                            Logout
                                        </button>
                                    </li>
                                ) : (
                                    <li onClick={() => setOpenNav(!openNav)} className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                        <Link to={"/login"} className="w-full flex items-center cursor-pointer btn btn-primary normal-case rounded-xl">
                                            <FaUser/>
                                            <span>
                                                Login
                                            </span>
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