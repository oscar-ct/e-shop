import {Link} from 'react-router-dom'
import Rating from "./Rating";
import {useState, useEffect} from "react";
import {motion} from "framer-motion";



const ProductItem = ( {product, smallSize = false, cardWidth = ""} ) => {
    const [imgIndex, setImageIndex] = useState(0);
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);

    useEffect(function () {
        const setInnerWidth = () => {
            setWindowInnerWidth(window.innerWidth);
        };
        window.addEventListener("resize", setInnerWidth);
        return () => {
            window.removeEventListener("resize", setInnerWidth)
        }
    }, []);
    return (
        <>
            <div className={"w-6/12 sm:w-72 p-1 sm:p-3"}>
                <motion.div initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`${cardWidth && cardWidth} rounded-xl flex flex-col bg-white shadow-xl h-full`}
                >
                    <Link to={`/product/${product._id}`} onMouseEnter={() => (windowInnerWidth >= 500 && product.images.length > 1) && setImageIndex(product.images.length - (product.images.length - 1))} onMouseLeave={() => (windowInnerWidth >= 500 && product.image.length > 1) && setImageIndex(0)}>
                        <figure className="p-2">
                            <img src={product.images.length !== 0 ? product.images[imgIndex].url : "/images/sample.jpg"} alt="product" className="bg-zinc-100/20 w-[248px] h-[197px] object-scale-down rounded-tr-xl rounded-tl-xl" />
                        </figure>
                    </Link>
                    <div className={`card-body p-2 sm:px-4 items-start h-full flex flex-col ${!smallSize ? "justify-between" : "justify-start"} `}>
                        <Link to={`/product/${product._id}`}
                              className={`w-full h-full text-concat ${smallSize && "max-height-2"} text-sm font-semibold`}
                        >
                            {product.name}
                            {/*<h2 className="text-concat text-sm font-semibold">{product.name.length > 65 ? `${product.name.substring(0, 65)}` : product.name}</h2>*/}
                            {/*<h2 className="text-concat text-sm font-semibold">{product.name}</h2>*/}
                        </Link>

                        {/*<p>{product.description}</p>*/}
                        {/*<div className={"w-full flex flex-col justify-end"}>*/}
                            <div className={`w-full text-xs ${!smallSize ? "sm:text-base" : " flex justify-between items-center"}`}>
                                <Rating rating={product.rating} text={`${product.numReviews} ${product.numReviews !== 1 ? "reviews" : "review"}`}/>
                                {
                                    smallSize && (
                                        // <div className={"w-full flex sm:pt-2 justify-end"}>
                                            <span className={"text-sm font-bold text-slate-500"}>${product.price}</span>
                                        // </div>
                                    )
                                }
                            </div>
                                {
                                    !smallSize && (
                                        <div className={"w-full flex sm:pt-2 justify-end"}>
                                            <span className={"sm:text-xl font-bold text-slate-500"}>${product.price}</span>
                                        </div>
                                    )
                                }
                        {/*</div>*/}
                        {/*<div className="card-actions">*/}
                        {/*    <button className="btn btn-primary">Buy Now</button>*/}
                        {/*</div>*/}
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ProductItem;