import {Link} from 'react-router-dom'
import Rating from "./Rating";

const ProductItem = ( {product, smallSize = false, cardWidth = ""} ) => {
    return (
        <>
            <div className={"w-6/12 sm:w-72 p-2 sm:p-3"}>
                <div className={`${cardWidth && cardWidth} card bg-white shadow-xl h-full`}>
                    <Link to={`/product/${product._id}`}>
                        <figure className="p-2">
                            <img src={product.images.length !== 0 ? product.images[0].url : "/images/sample.jpg"} alt="product" className="bg-zinc-100/20 w-[248px] h-[197px] object-scale-down rounded-tr-xl rounded-tl-xl" />
                        </figure>
                    </Link>
                    <div className={`card-body p-2 sm:px-4 items-start h-full flex flex-col ${!smallSize ? "justify-between" : "justify-start"} `}>
                        <Link to={`/product/${product._id}`}
                              className={"w-full h-full text-concat text-sm font-semibold"}
                        >
                            {product.name}
                            {/*<h2 className="text-concat text-sm font-semibold">{product.name.length > 65 ? `${product.name.substring(0, 65)}` : product.name}</h2>*/}
                            {/*<h2 className="text-concat text-sm font-semibold">{product.name}</h2>*/}
                        </Link>

                        {/*<p>{product.description}</p>*/}
                        {/*<div className={"w-full flex flex-col justify-end"}>*/}
                            <div className={`w-full text-xs ${!smallSize ? "sm:text-base" : "h-full flex justify-between items-center"}`}>
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
                </div>
            </div>
        </>
    );
};

export default ProductItem;