import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {saveShippingAddress} from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingPage = () => {

    const cartItems = useSelector(function (state) {
        return state.cart;
    });
    const {shippingAddress} = cartItems;

    const [shippingData, setShippingData] = useState({
        address: shippingAddress?.address || "",
        city: shippingAddress?.city || "",
        postalCode: shippingAddress?.postalCode || "",
        country: shippingAddress?.country || "",
    });
    const {address, city, postalCode, country} = shippingData;

    const onChange = (e) => {
        setShippingData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const submitShippingData = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address: address, city: city, postalCode: postalCode, country: country}));
        navigate("/payment");
    }

    return (
        <>
            <CheckoutSteps step1 />
            <div className={"w-full flex justify-center"}>
                <div className={"card p-10 w-[35em] bg-base-100 shadow-xl"}>
                    <div className={"w-full pb-5 flex justify-center"}>
                        <h1 className={"text-2xl font-bold"}>Shipping Information</h1>
                    </div>
                    <form onSubmit={submitShippingData} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 tracking-wide">Address
                            </label>
                            <input
                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                autoComplete={"address"}
                                type={"text"}
                                placeholder={"1600 Pennsylvania Ave"}
                                id={"address"}
                                value={address}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 tracking-wide">City
                            </label>
                            <input
                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                autoComplete={"city"}
                                type={"text"}
                                placeholder={"Washington, DC"}
                                id={"city"}
                                value={city}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 tracking-wide">Postal Code
                            </label>
                            <input
                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                autoComplete={"postalCode"}
                                type={"text"}
                                placeholder={"20500"}
                                id={"postalCode"}
                                value={postalCode}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 tracking-wide">Country
                            </label>
                            <input
                                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                autoComplete={"country"}
                                type={"text"}
                                placeholder={"United States"}
                                id={"country"}
                                value={country}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className={"pt-5 w-full flex justify-end"}>
                            <button className="btn btn-primary btn-wide">
                                Continue To Payment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ShippingPage;