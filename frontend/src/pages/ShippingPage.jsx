import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {saveShippingAddress} from "../slices/cartSlice";
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
    const [isValidShippingData, setIsValidShippingData] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
       if (shippingData.address.length !== 0 && shippingData.address.length < 64 && shippingData.city.length !== 0 && shippingData.city.length < 64 && (shippingData.postalCode.length === 5 && !isNaN(parseFloat(shippingData.postalCode)) && isFinite(shippingData.postalCode)) && shippingData.state.length !== 0 && shippingData.country.length !== 0) {
          setIsValidShippingData(true);
       } else {
           setIsValidShippingData(false);
       }
    });
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
            <CheckoutSteps/>
            <div className={"pt-0 w-full flex justify-center"}>
                <div className={"mb-10 pt-3 sm:pt-7 w-full sm:w-[35em]"}>
                    <div className={"hidden md:block py-2 text-center text-3xl md:text-2xl font-semibold ibmplex bg-white md:bg-neutral md:text-white"}>
                        <h1>Shipping Address</h1>
                    </div>
                    <div className={"px-10 pb-10 pt-5 w-full border"}>
                    {
                        useNewAddress ? (
                            <form onSubmit={submitShippingData} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">
                                        Address
                                    </label>
                                    <input
                                        className="bg-white w-full text-base px-4 py-2 border  border-gray-300 rounded-sm focus:outline-none focus:border-blue-400"
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
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">
                                        City
                                    </label>
                                    <input
                                        className="bg-white w-full text-base px-4 py-2 border  border-gray-300 rounded-sm focus:outline-none focus:border-blue-400"
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
                                            <Select placeholder={"Select State"} options={states} styles={customStyles} id={state} value={states.filter(obj => obj.value === shippingData.state)} onChange={onChangeSelect}/>
                                        </div>
                                        <div className={"w-4/12 md:w-6/12 pl-2"}>
                                            <label className="text-sm font-medium text-gray-700 tracking-wide">
                                                Postal Code
                                            </label>
                                            <input
                                                className="bg-white w-full text-base px-4 py-2 border  border-gray-300 rounded-sm focus:outline-none focus:border-blue-400"
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
                                    <Select placeholder={"Select Country"} options={countries} styles={customStyles} id={state} value={countries.filter(obj => obj.value === shippingData.country)} onChange={onChangeSelect}/>
                                </div>
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
                                <div className={"pt-5 w-full flex justify-end"}>
                                    <CustomBtn
                                        isDisabled={!isValidShippingData}
                                        type={"submit"}
                                    >
                                        Save and Continue
                                    </CustomBtn>
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
                                                        <div className={"w-10/12 flex flex-col justify-center"}>
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




