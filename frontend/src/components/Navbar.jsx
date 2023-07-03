import {useEffect, useState, useRef} from "react";
import {motion} from "framer-motion";
import {FaShoppingCart, FaUser, FaChevronDown} from "react-icons/fa";
import {ReactComponent as Logo} from "../icons/e.svg"
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux";
import {useLogoutMutation} from "../slices/usersApiSlice";
import {logout} from "../slices/authSlice";
import {clearCartItems} from "../slices/cartSlice";

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
    const documentRef = useRef(null);
    const [openNav, setOpenNav] = useState(false);
    const [dropdownActive, setDropdownActive] = useState(false);


    useEffect(function () {
        const closeOpenDropdown = (e) => {
            if (documentRef.current && dropdownActive && !documentRef.current.contains(e.target)) {
                setDropdownActive(false);
            }
        }
        dropdownActive && document.addEventListener('click', closeOpenDropdown);
    }, [dropdownActive]);

    useEffect(() => {
        if (openNav) {
            window.addEventListener("scroll", () => setOpenNav(false));
            window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
        }
    }, [openNav]);


    const styles = {
        active: {
            visibility: "visible",
            transition: "all 0.5s"
        },
        hidden: {
            visibility: "hidden",
            transition: "all 0.5s",
            transform: "translateY(-100%)"
        },
        hidden2: {
            visibility: "hidden",
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

    return (
        <>
            <nav className={`sticky inset-0 z-10 block h-max w-full max-w-full rounded-none py-5 shadow-md backdrop-blur-sm lg:py-4`}>
                <div className="px-5 flex justify-between items-center">
                    <div className={"hidden lg:flex lg:items-center cursor-pointer"}>
                        <motion.div
                            className={"text-xl flex"}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 1.0 }}
                        >
                            <Logo className={"w-5 mr-1"}/>
                            <span className={"italic font-light"}>-shopper</span>
                        </motion.div>
                    </div>
                    <div className={"flex"}>
                        {/*<ul className="ml-auto mr-8 hidden items-center gap-6 lg:flex">*/}
                        {/*    <li className="block p-1 font-normal antialiased hover:subpixel-antialiased">*/}
                        {/*        <button className="a flex items-center">*/}
                        {/*            Cart*/}
                        {/*        </button>*/}
                        {/*    </li>*/}
                        {/*</ul>*/}
                        <div className={"flex justify-end"}>
                            <div className="ml-auto hidden items-center gap-2 lg:flex">
                                    <div className="flex-none">
                                        <div className="dropdown dropdown-end">
                                            <label tabIndex={0} className="btn btn-ghost">
                                                <div className="indicator">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                    {
                                                        cartItems.length !== 0 && (
                                                            <span className="badge text-white bg-primary badge-sm indicator-item">{totalCartItems}</span>
                                                        )
                                                    }

                                                </div>
                                                <span className={"normal-case"}>Cart</span>
                                            </label>
                                            <div tabIndex={0} className="mt-2 z-[1] card card-compact dropdown-content w-52 bg-neutral shadow">
                                                <div className="card-body">
                                                    {
                                                        cartItems.length !== 0 ? (
                                                            <>
                                                                <span className="font-bold text-white text-lg">{totalCartItems} Items</span>
                                                                <span className="font-bold text-info">Subtotal: {subtotalPrice}</span>
                                                            </>
                                                        ) : (
                                                                <span className={"font-bold text-white text-lg"}>0 Items</span>
                                                        )
                                                    }

                                                    <div className="card-actions">
                                                        <Link to={"/cart"} className="btn btn-primary btn-block">View cart</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                {
                                    userData ? (

                                        <div ref={documentRef} className="relative inline-block text-left">
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
                                                    <div
                                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right"
                                                        role="menu" aria-orientation="vertical" aria-labelledby="menu-button"
                                                        tabIndex="-1">
                                                        <div role="none">
                                                            <ul role="menuitem" tabIndex="-1" id="menu-item-0" className="menu bg-neutral w-56 rounded-box text-white font-bold flex flex-col justify-between">
                                                                <li><a className={""}>Profile</a></li>
                                                                <li><button onClick={logoutHandler}>Logout</button></li>
                                                            </ul>
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


{/*/////// mobile nav ///////*/}
                    <button className="middle none relative mr-auto h-6 max-h-[40px] w-6 max-w-[40px] rounded-lg text-center uppercase transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden" onClick={() => setOpenNav(!openNav)}>

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
                </div>



                <div className={`fixed top-[4rem] left-0 w-9/12 md:w-6/12 bg-gray-200 py-6 rounded-r-xl lg:hidden`} style={openNav ? styles.active : styles.hidden2}>
                    <div className={"flex flex-col justify-center h-full w-full"}>
                        <ul className="flex flex-col font-bold text-xl">
                            <li className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                <FaShoppingCart/>
                                <span className={"pl-2"}>
                                    Cart
                                </span>
                            </li>
                            <li className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer px-8">
                                <FaUser/>
                                <span className={"pl-2"}>
                                    Login
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
{/*/////// mobile nav ///////*/}
            </nav>
        </>
    );
};

export default Navbar;