import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FaShoppingCart, FaUser} from "react-icons/fa";
import {ReactComponent as Logo} from "../icons/e.svg"


const Navbar = () => {

    const [openNav, setOpenNav] = useState(false);
    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false)
        );
        if (openNav) {
            window.addEventListener(
                "scroll",
                () => setOpenNav(false)
            );
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
    }


    return (
        <>
            <nav className={`sticky inset-0 z-10 block h-max w-full max-w-full rounded-none py-5 shadow-md backdrop-blur-sm  lg:py-4 lg:mb-8`}>
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
                            <ul className="ml-auto mr-8 hidden items-center gap-6 lg:flex">
                                <motion.li
                                    className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 1.0 }}>
                                    <FaShoppingCart/>
                                    <span className={"pl-2"}>
                                        Cart
                                    </span>

                                </motion.li>
                                <motion.li
                                    className="flex items-center p-1 font-normal antialiased hover:subpixel-antialiased cursor-pointer"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 1.0 }}>
                                    <FaUser/>
                                    <span className={"pl-2"}>
                                        Login
                                    </span>
                                </motion.li>
                            </ul>
                        </div>
                    </div>
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
{/*/////// mobile nav ///////*/}
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