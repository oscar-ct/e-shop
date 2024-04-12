import {addToCart} from "../slices/cartSlice";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";

const QuantitySelect = ({quantity, products, item}) => {

    const dispatch = useDispatch();
    const addToCartHandler = async (item, quantity) => {
        dispatch(addToCart({
            ...item, quantity
        }));
    };

    const [width, setWidth] = useState(window.innerWidth);
    const [quantityText, setQuantityText] = useState(window.innerWidth > 500 ? "Quantity:" : "Qty:");

    useEffect(() => {
        const adjustWidth = () => {
            setWidth(window.innerWidth)
        };
        window.addEventListener("resize", adjustWidth)
        return () => removeEventListener("resize", adjustWidth)
    }, []);

    useEffect(() => {
        if (width > 500) {
            setQuantityText("Quantity:")
        } else {
            setQuantityText("Qty:")
        }
    }, [width]);

    return (
        <div className={"rounded-md border-gray-200 border h-12 flex justify-start items-center px-2"}>
            <label htmlFor={"qty"} className={"text-sm font-semibold pr-1"}>{quantityText}</label>
            <select
                id={"qty"}
                className="h-full w-full md:w-16 !outline-none text-sm bg-white cursor-pointer"
                value={quantity}
                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
            >
                {
                    [...Array(products).keys()].map(function (x) {
                        return (
                            <option key={x+1} value={x+1}>
                                {x+1}
                            </option>
                        )
                    })
                }
            </select>
        </div>
    );
};

export default QuantitySelect;