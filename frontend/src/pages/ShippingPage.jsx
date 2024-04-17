import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {saveShippingAddress, saveGuestData} from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import {useUpdateUserAddressMutation} from "../slices/usersApiSlice";
import {setCredentials} from "../slices/authSlice";
import Meta from "../components/Meta";
import CustomBtn from "../components/CustomBtn";
import Select from "react-select";
import {countries, states} from "../utils/locationData";
import {customStyles} from "../utils/selectCustomStyles";

const ShippingPage = () => {

    const cartState = useSelector(function (state) {
        return state.cart;
    });
    const {shippingAddress, cartItems, guestData} = cartState;

    const {userData} = useSelector(function (state) {
        return state.auth;
    });
    const [updateUserAddress] = useUpdateUserAddressMutation();

    const userId = userData?.shippingAddresses.filter(function (x) {
        return x._id === cartState.shippingAddress._id;
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const shipStatus = () => {
        if (userData) {
            if (Object.keys(shippingAddress).length !== 0) {
                // return Object.hasOwn(shippingAddress, "_id");
                return !Object.hasOwnProperty.call(shippingAddress, "_id");
            }
            return userData.shippingAddresses.length === 0;
        }
        else {
            return true;
        }
    };

    const [radioId, setRadioId] = useState(Object.hasOwnProperty.call(shippingAddress, "_id") ? userId[0]._id : "");
    const [savePaymentData, setSavePaymentData] = useState(false);
    const [useNewAddress, setUseNewAddress] = useState(shipStatus());
    const [guestEmail, setGuestEmail] = useState(guestData ? guestData : "");
    const [isValidShippingData, setIsValidShippingData] = useState(false);
    const [shippingData, setShippingData] = useState({
        name: "",
        address: "",
        city: "",
        postalCode: "",
        state: "",
        country: "",
    });
    const {address, city, postalCode, state, country, name} = shippingData;
    // const [additionalAddress, setAdditionalAddress] = useState("")
    // const [isAdditionalAddressActive, setIsAdditionalAddressActive] = useState(false);

    useEffect(() => {
        if (Object.keys(shippingAddress).length !== 0 && Object.hasOwnProperty.call(shippingAddress,"_id")) {
            return;
        }
        if (Object.keys(shippingAddress).length !== 0) {
            setShippingData({
                name: shippingAddress.name,
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                state:  shippingAddress.state,
                country: shippingAddress.country,
            });
        }
    }, [shippingAddress, userData]);

    const validAddressCharLimit = 48;
    const validCityCharLimit = 48;
    const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    const validNameCharLimit = 48;

    const isValidPostalCode = (zipCode) => {
        return zipCode.length === 5 && !isNaN(parseFloat(zipCode)) && isFinite(zipCode)
    };

    useEffect(() => {
       if (shippingData.address.length !== 0 && shippingData.address.length < validAddressCharLimit && shippingData.city.length !== 0 && shippingData.city.length < validCityCharLimit && isValidPostalCode(shippingData.postalCode) && shippingData.state.length !== 0 && shippingData.country.length !== 0 && shippingData.name.length !== 0 && shippingData.name.length < validNameCharLimit) {
          setIsValidShippingData(true);
       } else {
           setIsValidShippingData(false);
       }
    }, [shippingData.address.length, shippingData.city.length, shippingData.postalCode.length, shippingData.postalCode, shippingData.state.length, shippingData.country.length, shippingData.name.length]);

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
    const onChangeSelect = (e) => {
        setShippingData(prevState => ({
            ...prevState,
            [e.id]: e.value,
        }));
    }

    const radioSelectAddress = userData?.shippingAddresses?.filter(function (x) {
        return x._id === radioId;
    });

    const submitShippingData = async (e) => {
        e.preventDefault();
        if (useNewAddress) {
            if (savePaymentData) {
                try {
                    const updatedUser = await updateUserAddress({name, address, city, state, postalCode, country}).unwrap();
                    const mongodbShippingDataWithObjectId = updatedUser.shippingAddresses.filter(function (x) {
                        return x.name === name && x.address === address && x.city === city && x.postalCode === postalCode && x.country === country;
                    });
                    dispatch(saveShippingAddress(mongodbShippingDataWithObjectId[0]));
                    navigate("/payment");
                    dispatch(setCredentials(updatedUser));
                    // dispatch(updateShippingData(updatedUser.shippingAddresses)); // this does not work
                } catch (e) {
                    console.log(e);
                }
            } else {
                dispatch(saveGuestData(guestEmail));
                dispatch(saveShippingAddress({name, address, city, state, postalCode, country}));
                navigate("/payment");
            }
        } else {
            dispatch(saveShippingAddress(radioSelectAddress[0]));
            navigate("/payment");
        }
    };

    const dynamicBorder = (boolean, string) => {
        if (string.length === 0) {
            return "";
        }
        return boolean ? "!border-green-500 focus:ring-green-100" : "!border-red-500 focus:ring-red-100";
    };

    return (
        <>
            <Meta title={"Shipping Address"}/>
            <CheckoutSteps/>
            <div className={"pt-0 w-full flex justify-center"}>
                <div className={"pt-3 sm:pt-7 w-full sm:w-[35em]"}>
                    <div className={"hidden md:block py-2 text-center text-3xl md:text-2xl font-semibold ibmplex bg-white md:bg-zinc-700 md:text-white"}>
                        {
                            useNewAddress ? (
                                <h1>Enter your Shipping Address</h1>
                            ) : (
                                <h1>Select your Shipping Address</h1>
                            )
                        }

                    </div>
                    {
                        useNewAddress ? (
                            <h1 className={"md:hidden pt-7 text-center font-semibold text-4xl bg-white px-5"}>
                               Enter your Shipping Address
                            </h1>
                        ) : (
                            <h1 className={"md:hidden pt-7 text-center font-semibold text-4xl bg-white px-5"}>
                                Select your Shipping Address
                            </h1>
                        )
                    }
                    <div className={"md:shadow-lg bg-white px-10 pb-5 pt-5 w-full md:border"}>
                    {
                        useNewAddress ? (
                            <form onSubmit={submitShippingData} className="space-y-5">
                                {
                                    !userData && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">
                                                Customer Email
                                            </label>
                                            <input
                                                className={`${dynamicBorder(emailRegex.test(guestEmail), guestEmail)} bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400`}
                                                autoComplete={"email"}
                                                type={"email"}
                                                placeholder={"example@email.com"}
                                                id={"email"}
                                                value={guestEmail}
                                                onChange={(e) => setGuestEmail(e.target.value)}
                                                required
                                            />
                                            <div className={"text-xs sm:text-sm w-full flex justify-center"}>(this email will be only be used to contact you about your order)</div>
                                        </div>
                                    )
                                }
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">
                                        Recipient&apos;s Name
                                    </label>
                                    <input
                                        className={`${dynamicBorder(name.length < validNameCharLimit, name)} bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400`}
                                        autoComplete={"name"}
                                        type={"text"}
                                        placeholder={"John Doe"}
                                        id={"name"}
                                        value={name}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">
                                        Street Address
                                    </label>
                                    <input
                                        className={`${dynamicBorder(address.length < validAddressCharLimit, address)} bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400`}
                                        autoComplete={"address"}
                                        type={"text"}
                                        placeholder={"600 Navarro St #400"}
                                        id={"address"}
                                        value={address}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                {/*{*/}
                                {/*    !isAdditionalAddressActive ? (*/}
                                {/*        <div>*/}
                                {/*            <span onClick={() => setIsAdditionalAddressActive(true)} className={"text-sm font-medium text-primary pl-2 cursor-pointer hover:text-primary/80"}>+ Add apartment, suite, etc.</span>*/}
                                {/*        </div>*/}
                                {/*    ) : (*/}
                                {/*        <div className="space-y-2">*/}
                                {/*            <label className="text-sm font-medium text-gray-700 tracking-wide">*/}
                                {/*                Apartment, suite, etc. (optional)*/}
                                {/*            </label>*/}
                                {/*            <input*/}
                                {/*                className={`bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-sm focus:outline-none`}*/}
                                {/*                autoComplete={"address"}*/}
                                {/*                type={"text"}*/}
                                {/*                placeholder={"Apt# 2213"}*/}
                                {/*                id={"address"}*/}
                                {/*                value={additionalAddress}*/}
                                {/*                onChange={(e) => setAdditionalAddress(e.target.value)}*/}
                                {/*            />*/}
                                {/*        </div>*/}
                                {/*    )*/}
                                {/*}*/}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">
                                        City
                                    </label>
                                    <input
                                        className={`${dynamicBorder(city.length < validCityCharLimit, city)} bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400`}
                                        autoComplete={"home city"}
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
                                        <div className={"w-8/12 md:w-6/12 pr-2"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">
                                                State
                                            </label>
                                            <Select placeholder={"Select State"}
                                                    options={states}
                                                    styles={{...customStyles, control: (base) => ({
                                                            ...base,
                                                            padding: "2px",
                                                            borderRadius: 6,
                                                            cursor: "pointer",
                                                            fontSize: "16px",
                                                        }),
                                                    }}
                                                    id={state}
                                                    value={states.filter(obj => obj.value === shippingData.state)}
                                                    onChange={onChangeSelect}
                                            />
                                        </div>
                                        <div className={"w-4/12 md:w-6/12 pl-2"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">
                                                ZIP Code
                                            </label>
                                            <input
                                                className={`${dynamicBorder(isValidPostalCode(postalCode), postalCode)} bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400`}
                                                autoComplete={"locality"}
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
                                    <Select
                                        placeholder={"Select Country"}
                                        options={countries}
                                        styles={{...customStyles, control: (base) => ({
                                                ...base,
                                                padding: "2px",
                                                borderRadius: 6,
                                                cursor: "pointer",
                                                fontSize: "16px",
                                            }),
                                        }}
                                        id={state}
                                        value={countries.filter(obj => obj.value === shippingData.country)}
                                        onChange={onChangeSelect}
                                    />
                                </div>
                                {
                                    userData && (
                                        <div className="w-full flex justify-end">
                                        {
                                            userData.shippingAddresses?.length !== 0 && (
                                                <div className={"py-3 w-6/12 flex items-center"}>
                                                    <span onClick={() => setUseNewAddress(prevState => !prevState)} className={"text-sm text-start link link-primary"}>Use Saved Address</span>
                                                </div>
                                            )
                                        }

                                        <label className="py-3 w-6/12 flex items-center justify-end cursor-pointer">
                                            <span className="text-sm pr-2">Save this address</span>
                                            <input type="checkbox" checked={savePaymentData} onChange={() => setSavePaymentData(prevState => !prevState)} className="checkbox checkbox-primary" />
                                        </label>
                                    </div>
                                    )
                                }
                                <div className={"pt-5 w-full flex justify-end"}>
                                    <CustomBtn
                                        isDisabled={!isValidShippingData || ( userData ? false : !emailRegex.test(guestEmail))}
                                        type={"submit"}
                                    >
                                        Save and Continue
                                    </CustomBtn>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={submitShippingData}>
                                {
                                    userData?.shippingAddresses.map(function(item, index) {
                                        return (
                                            <div key={index} className="my-5" onClick={() => setRadioId(item._id)}>
                                                <div className={`w-full rounded-md shadow-sm border cursor-pointer ${item._id === radioId && "ring-2 border-green-500 ring-green-100"}`}>
                                                    <div className={"w-full flex p-6"}>
                                                        <div className={"text-sm w-10/12 flex flex-col justify-center"}>
                                                             <span className={"truncate"}>
                                                                {item.name}
                                                            </span>
                                                            <span className={"truncate"}>
                                                                {item.address}
                                                            </span>
                                                            <span className={"truncate"}>
                                                                {`${item.city}, ${item.state} ${item.postalCode} `}
                                                            </span>
                                                            <span className={"truncate"}>
                                                                {item.country}
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
                                    <span onClick={() => setUseNewAddress(prevState => !prevState)} className={"text-sm text-end link link-primary"}>Use New Address</span>
                                </div>
                                <div className={"pt-5 w-full flex justify-end"}>
                                    <CustomBtn isDisabled={radioId === ""} type={"submit"}>
                                        Save and Continue
                                    </CustomBtn>
                                </div>
                            </form>
                        )
                    }
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShippingPage;




