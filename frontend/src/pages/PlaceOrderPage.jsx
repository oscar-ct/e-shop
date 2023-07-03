import React from 'react';
import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";

const PlaceOrderPage = () => {

    const cartItems = useSelector(function (state) {
        return state.cart;
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(function () {
        if (cartItems.shippingAddress === {}) {
            navigate("/shipping");
        } else if (!cartItems.paymentMethod) {
            navigate("/payment");
        }
    }, [cartItems.shippingAddress, cartItems.paymentMethod])


    return (
        <>
            <CheckoutSteps step3 />
        </>
    );
};

export default PlaceOrderPage;