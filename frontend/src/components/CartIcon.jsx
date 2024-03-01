import {Link} from "react-router-dom";
import {useEffect, useState, useRef} from "react";

const CartIcon = ({cartItems, totalCartItems, subtotalPrice}) => {

    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
    const [cartDropdownActive, setCartDropdownActive] = useState(false);
    const documentRef5 = useRef();

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
        const closeUserOpenDropdown = (e) => {
            if (!documentRef5?.current?.contains(e.target)) {
                setCartDropdownActive(false);
            }
        }
        if (cartDropdownActive) {
            window.addEventListener('mouseout', closeUserOpenDropdown);
        }
        return () => window.removeEventListener("mouseout", closeUserOpenDropdown);

    }, [cartDropdownActive]);

    return (
        <>
            {
                windowInnerWidth <= 500 ? (
                    <Link to={"/cart"} className="px-2 btn btn-ghost">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {
                                cartItems.length !== 0 && (
                                    <span className="badge text-white bg-primary badge-sm indicator-item">{totalCartItems}</span>
                                )
                            }
                        </div>
                        <span className={"hidden md:flex normal-case"}>Cart</span>
                    </Link>
                ) : (
                    <div  ref={documentRef5} className="dropdown dropdown-end py-4">
                        <label onMouseEnter={() => setCartDropdownActive(prevState => !prevState)} className="px-2 btn btn-ghost">
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
                        {
                            cartDropdownActive && (
                                <div className="mt-4 z-10 absolute right-0 origin-top-right w-52 bg-neutral/70 shadow rounded-b-md">
                                    <div className="p-5">
                                        {
                                            cartItems.length !== 0 ? (
                                                <>
                                                    <span className="font-bold text-white text-xl">({totalCartItems}) {totalCartItems > 1 ? "Items" : "Item"}</span>
                                                    <div className="font-bold text-info py-3">
                                                        Subtotal:<span className={"pl-2 text-white"}>${subtotalPrice}</span>
                                                    </div>
                                                    <Link to={"/cart"} className="btn btn-primary btn-block text whitespace-nowrap uppercase rounded-md">
                                                        View Cart
                                                    </Link>
                                                </>
                                            ) : (
                                                <span className={"font-bold text-white text-center text-xl"}>
                                    Your cart is empty...
                                </span>
                                            )
                                        }

                                    </div>
                                </div>
                            )
                        }

                    </div>
                )
            }

        </>
    );
};

export default CartIcon;