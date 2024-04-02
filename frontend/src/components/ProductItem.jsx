import {Link, useNavigate} from 'react-router-dom'
import Rating from "./Rating";
import {useState} from "react";
import {motion} from "framer-motion";
import Reveal from "./Reveal";
import CustomBtn from "./CustomBtn";
import {addToCart} from "../slices/cartSlice";
import {toast} from "react-hot-toast";
import {useDispatch} from "react-redux";


const ProductItem = ( {product, smallSize = false, cardWidth = "", windowInnerWidth} ) => {
    const [count, setCount] = useState(0);
    const [imgIndex, setImageIndex] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const quantity = 1;
    const addToCartHandler = () => {
        dispatch(addToCart({
            ...product, quantity
        }));
        toast.success(() => {
            return <Link to={"/cart"}>Added To Cart</Link>
        });
        // navigate("/cart");
    };
    const navigateHandler = () => {
        if (count === 0) {
            navigate(`/product/${product._id}`);
        }
    };

    return (
        <div onClick={navigateHandler} className={"w-6/12 sm:w-72 p-1 sm:p-3 cursor-pointer"}>
            <Reveal
                customParentClass={"h-full"}
                customChildClass={"h-full"}
                isSmallScreen={windowInnerWidth <= 768}
            >
                <motion.div
                    transition={{ duration: 0.25 }}
                    whileHover={windowInnerWidth >= 768 ? { scale: 1.1} : {scale: 1}}
                    whileTap={windowInnerWidth >= 768 ? { scale: 0.9} : {scale: 1}}
                    className={`${cardWidth && cardWidth} rounded-2xl border-[1px] border-black md:border-gray-300 flex flex-col bg-white md:shadow-md h-full`}
                >
                    <div
                        onMouseEnter={() => (windowInnerWidth >= 500 && product.images.length > 1) && setImageIndex(product.images.length - (product.images.length - 1))}
                        onMouseLeave={() => (windowInnerWidth >= 500 && product.image.length > 1) && setImageIndex(0)}
                    >
                        <figure className="p-2">
                            <img src={product.images.length !== 0 ? product.images[imgIndex].url : "/images/sample.jpg"} alt="product" className="bg-zinc-100/20 w-[248px] h-[197px] object-scale-down rounded-tr-xl rounded-tl-xl" />
                        </figure>
                    </div>
                    <div className={`card-body p-2 sm:px-4 items-start h-full flex flex-col ${!smallSize ? "justify-between" : "justify-start"} `}
                    >
                        <div className={`w-full h-full text-concat ${smallSize && "max-height-2"} text-sm font-semibold`}>
                            {product.name}
                            {/*<h2 className="text-concat text-sm font-semibold">{product.name.length > 65 ? `${product.name.substring(0, 65)}` : product.name}</h2>*/}
                            {/*<h2 className="text-concat text-sm font-semibold">{product.name}</h2>*/}
                        </div>
                        <div className={`w-full text-xs ${!smallSize ? "sm:text-base" : " flex justify-between items-center"}`}>
                            <Rating rating={product.rating} text={`(${product.numReviews})`}/>
                            {
                                smallSize && (
                                    <span className={"text-sm font-bold text-slate-500"}>
                                        ${product.price}
                                    </span>
                                )
                            }
                        </div>

                        {
                            !smallSize && (
                                <div className={"w-full flex flex-col sm:pt-2 justify-around"}>
                                    <span className={"sm:text-xl font-bold text-slate-500"}>${product.price}</span>
                                    <div className={"w-full flex justify-center py-2"} >
                                        <CustomBtn onTouchStart={count + 1} onTouchEnd={count - 1} onMouseEnter={() => setCount(count + 1)} onMouseLeave={() => setCount(count - 1)} onClick={() => addToCartHandler()} customClass={"text-sm w-10/12 bg-zinc-600"}>
                                            Add To Cart
                                        </CustomBtn>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </motion.div>
            </Reveal>
        </div>

    );
};

export default ProductItem;