import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {saveShippingAddress} from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import {useUpdateUserAddressMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import Meta from "../components/Meta";

const ShippingPage = () => {

    const cartState = useSelector(function (state) {
        return state.cart;
    });
    const {shippingAddress, cartItems} = cartState;

    const {userData} = useSelector(function (state) {
        return state.auth;
    });
    const [updateUserAddress] = useUpdateUserAddressMutation();

    const userId = userData.shippingAddresses.filter(function (x) {
        return x._id === cartState.shippingAddress._id;
    });

    const shipStatus = () => {
        if (Object.keys(shippingAddress).length !== 0) {
            // return Object.hasOwn(shippingAddress, "_id");
            return !Object.hasOwnProperty.call(shippingAddress, "_id");
        }
        return userData.shippingAddresses.length === 0;
    }
    const [radioId, setRadioId] = useState(Object.hasOwnProperty.call(shippingAddress, "_id") ? userId[0]._id : "");
    const [useNewAddress, setUseNewAddress] = useState(shipStatus());
    const [savePaymentData, setSavePaymentData] = useState(false);
    const [shippingData, setShippingData] = useState({
        address: Object.hasOwnProperty.call(shippingAddress,"_id") ? "" : shippingAddress?.address ? shippingAddress.address : "",
        city: Object.hasOwnProperty.call(shippingAddress, "_id") ? "" : shippingAddress?.city ? shippingAddress.city : "",
        postalCode: Object.hasOwnProperty.call(shippingAddress,"_id") ? "" : shippingAddress?.postalCode ? shippingAddress.postalCode : "",
        state: Object.hasOwnProperty.call(shippingAddress,"_id") ? "" : shippingAddress?.state ? shippingAddress.state : "",
        country: Object.hasOwnProperty.call(shippingAddress,"_id") ? "" : shippingAddress?.country ? shippingAddress.country : "",
    });
    const {address, city, postalCode, state, country} = shippingData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(function () {
        if (cartItems.length === 0) {
            navigate("/");
        }
    }, [navigate, cartItems, dispatch]);

    const onChange = (e) => {
        setShippingData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const radioSelectAddress = userData.shippingAddresses?.filter(function (x) {
        return x._id === radioId;
    });

    const submitShippingData = async (e) => {
        e.preventDefault();
        if (useNewAddress) {
            if (savePaymentData) {
                try {
                    const updatedUser = await updateUserAddress(shippingData).unwrap();
                    const mongodbShippingDataWithObjectId = updatedUser.shippingAddresses.filter(function (x) {
                        return x.address === address && x.city === city && x.postalCode === postalCode && x.country === country;
                    });
                    console.log(mongodbShippingDataWithObjectId)
                    dispatch(saveShippingAddress(mongodbShippingDataWithObjectId[0]));
                    navigate("/payment");
                    dispatch(setCredentials(updatedUser));
                    // dispatch(updateShippingData(updatedUser.shippingAddresses)); // this does not work
                } catch (e) {
                    console.log(e);
                }
            } else {
                dispatch(saveShippingAddress({address: address, city: city, state: state, postalCode: postalCode, country: country}));
                navigate("/payment");
            }
        } else {
            dispatch(saveShippingAddress(radioSelectAddress[0]));
            navigate("/payment");
        }

    };

    return (
        <>
            <Meta title={"Shipping Address"}/>
            <CheckoutSteps step2 />
            <div className={"pt-3 sm:pt-0 w-full flex justify-center"}>
                <div className={"mb-10 card p-10 w-[35em] bg-white shadow-xl"}>
                    <div className={"w-full pb-5 flex justify-center"}>
                        <h1 className={"text-2xl font-semibold"}>Shipping Address</h1>
                    </div>

                    {
                        useNewAddress ? (
                            <form onSubmit={submitShippingData} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">Address
                                    </label>
                                    <input
                                        className="bg-white w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"address"}
                                        type={"text"}
                                        placeholder={"600 Navarro St #300"}
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
                                        className="bg-white w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"city"}
                                        type={"text"}
                                        placeholder={"San Antonio"}
                                        id={"city"}
                                        value={city}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className={"flex w-full"}>
                                        <div className={"w-6/12 pr-2"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">State
                                            </label>
                                            <input
                                                className="bg-white w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                autoComplete={"state"}
                                                type={"text"}
                                                placeholder={"Texas"}
                                                id={"state"}
                                                value={state}
                                                onChange={onChange}
                                                required
                                            />
                                        </div>
                                        <div className={"w-6/12 pl-2"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">Postal Code
                                            </label>
                                            <input
                                                className="bg-white w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                                autoComplete={"postalCode"}
                                                type={"text"}
                                                placeholder={"78205"}
                                                id={"postalCode"}
                                                value={postalCode}
                                                onChange={onChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">Country
                                    </label>
                                    <input
                                        className="bg-white w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"country"}
                                        type={"text"}
                                        placeholder={"United States"}
                                        id={"country"}
                                        value={country}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className="w-full flex justify-end">
                                    {
                                        userData.shippingAddresses?.length !== 0 && (
                                            <div className={"py-3 w-6/12 flex items-center"}>
                                                <span onClick={() => setUseNewAddress(prevState => !prevState)} className={"text-start link link-primary"}>Use Saved Address</span>
                                            </div>
                                        )
                                    }

                                    <label className="py-3 w-6/12 flex items-center justify-end cursor-pointer">
                                        <span className="label-text pr-1 ">Save this address</span>
                                        <input type="checkbox" checked={savePaymentData} onChange={() => setSavePaymentData(prevState => !prevState)} className="checkbox checkbox-primary" />
                                    </label>
                                </div>
                                <div className={"pt-5 w-full flex justify-end"}>
                                    <button disabled={shippingData.address.length === 0 || shippingData.city.length === 0 || shippingData.postalCode.length === 0 || shippingData.state.length === 0 || shippingData.country.length === 0} className={`${(shippingData.address.length !== 0 && shippingData.city.length !== 0 && shippingData.postalCode.length !== 0 && shippingData.country.length !== 0) && "shadow-blue"} btn btn-primary btn-wide`}>
                                        Continue To Payment
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={submitShippingData}>
                                {
                                    userData.shippingAddresses.map(function(item, index) {
                                        return (
                                            <div key={index} className="my-5">
                                                <div className={"w-full card bg-zinc-100 cursor-pointer"}>
                                                    <div className={"w-full flex p-6"}>
                                                        <div className={"w-10/12 flex  items-center"}>
                                                            <span className={"text-md"}>
                                                                {`${item.address} ${item.city}, ${item.state} ${item.postalCode} ${item.country}`}
                                                            </span>
                                                        </div>
                                                        <div className={"w-2/12 flex items-center"}>
                                                            <input
                                                                type="radio"
                                                                name="address"
                                                                id={index.toString()}
                                                                value={item._id}
                                                                className="radio radio-primary"
                                                                onChange={(e) => {setRadioId(e.target.value)}}
                                                                checked={item._id === radioId}
                                                                />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div className={"py-3"}>
                                    <span onClick={() => setUseNewAddress(prevState => !prevState)} className={"text-end link link-primary"}>Use New Address</span>
                                </div>
                                <div className={"pt-5 w-full flex justify-end"}>
                                    <button
                                        disabled={radioId === ""}
                                        className={`${radioId !== "" && "shadow-blue"} btn btn-primary btn-wide rounded-xl`}>
                                        Continue To Payment
                                    </button>
                                </div>
                            </form>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default ShippingPage;




