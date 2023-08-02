import React from 'react';
import {Link} from "react-router-dom";

const CartIcon = ({cartItems, totalCartItems, subtotalPrice}) => {
    return (
        <>
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
                                                            <span className="font-bold text-white text-lg">
                                                                ({totalCartItems}) {totalCartItems > 1 ? "items" : "item"}
                                                            </span>
                                    <span className="font-bold text-info">
                                                                Subtotal:
                                                                <span className={"pl-2 text-white"}>
                                                                    ${subtotalPrice}
                                                                </span>
                                                            </span>
                                    <div className="card-actions">
                                        <Link to={"/cart"} className="btn btn-primary btn-block">
                                            View cart
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <span className={"font-bold text-white text-center text-sm"}>
                                                                Your cart is empty...
                                                            </span>
                            )
                        }

                    </div>
                </div>
            </div>
        </>
    );
};

export default CartIcon;