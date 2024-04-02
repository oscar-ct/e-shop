import {Link, useNavigate} from 'react-router-dom'
import Rating from "./Rating";
import {useCallback, useState} from "react";
import {motion} from "framer-motion";
import Reveal from "./Reveal";
import {addToCart} from "../slices/cartSlice";
import {toast} from "react-hot-toast";
import {useDispatch} from "react-redux";
import {useEffect, useRef} from "react";
import CustomBtn from "./CustomBtn";


const ProductItem = ( {product, smallSize = false, cardWidth = "", windowInnerWidth} ) => {

    const [imgIndex, setImageIndex] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const quantity = 1;

    const addToCartHandler = useCallback(() => {
        dispatch(addToCart({
            ...product, quantity
        }));
        toast.success(() => {
            return <Link to={"/cart"}>Added To Cart</Link>
        });
    }, [dispatch, product, quantity]);

    // const navigateHandler = () => {
    //     navigate(`/product/${product._id}`);
    // };

    const buttonRef = useRef();
    const cardRef = useRef();

    useEffect(() => {
        const handleButtonClick = (event) => {
            if (buttonRef?.current?.contains(event.target)) {
                if (product.countInStock !== 0) {
                    addToCartHandler();
                }
            }
        };
        window.addEventListener("click", handleButtonClick);
        return () => window.removeEventListener("click", handleButtonClick);
    }, [addToCartHandler, product.countInStock]);


    useEffect(() => {
        const handleCardClick = (event) => {
            if (!buttonRef?.current?.contains(event.target) && cardRef?.current?.contains(event.target)) {
                navigate(`/product/${product._id}`);
            }
        };
        window.addEventListener("click", handleCardClick);
        return () => window.removeEventListener("click", handleCardClick);
    }, [navigate, product._id]);

    return (
        <div ref={cardRef} className={"w-6/12 sm:w-72 p-1 sm:p-3 cursor-pointer relative"}>
            <Reveal
                customParentClass={"h-full"}
                customChildClass={"h-full"}
                isSmallScreen={windowInnerWidth <= 768}
            >
                <motion.div
                    transition={{ duration: 0.25 }}
                    whileHover={windowInnerWidth >= 768 ? { scale: 1.05} : {scale: 1}}
                    // whileTap={windowInnerWidth >= 768 ? { scale: 0.9} : {scale: 1}}
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
                                    <div ref={buttonRef} className={"my-2 w-10/12 h-full self-center"}>
                                        {
                                            product.countInStock !== 0 ? (
                                                <motion.button
                                                    whileTap={{scale: 0.9}}
                                                    className={`w-full relative rounded-full px-5 py-2 text-base overflow-hidden group bg-zinc-600 relative md:hover:bg-gradient-to-r md:hover:from-violet-600 md:hover:to-violet-500 text-white md:hover:ring-2 md:hover:ring-offset-0 md:hover:ring-violet-500 md:transition-all md:ease-out md:duration-300"}`}
                                                    type={"button"}
                                                >
                                                    <span className={"md:absolute md:right-0 md:w-8 md:h-32 md:-mt-12 md:transition-all md:duration-500 md:transform md:translate-x-12 md:bg-white md:opacity-10 md:rotate-12 md:group-hover:-translate-x-40 md:ease"}/>
                                                    <span className={"relative ibmplex text-sm"}>Add To Cart</span>
                                                </motion.button>
                                            ) : (
                                                <CustomBtn isDisabled={true} customClass={"py-2 text-sm w-full"}>
                                                    Out Of Stock
                                                </CustomBtn>
                                            )
                                        }
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