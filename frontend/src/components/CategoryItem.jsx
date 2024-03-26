import {Link} from 'react-router-dom'
import {motion} from "framer-motion";
import Reveal from "./Reveal";

const CategoryItem = ({product, windowInnerWidth}) => {
    return (
        <>
            <Link to={`/sort/latest/select/${product.category.toLowerCase()}`} className={"w-6/12 sm:w-[175px] p-1 sm:py-3 sm:px-2"}>
                <Reveal
                    isSmallScreen={windowInnerWidth <= 768}
                >
                    <motion.div
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                whileHover={windowInnerWidth > 640 ? { scale: 1.1} : {scale: 1}}
                                whileTap={windowInnerWidth > 640 ? { scale: 0.9} : {scale: 1}}
                                className={`rounded-sm flex flex-col items-center bg-white md:shadow-md h-full w-full`}
                    >
                        <div className="p-2 flex justify-center">
                            <img src={product.images[product.images.length > 1 ? 1 : 0].url} alt="product" className="bg-zinc-100/20 h-[9em] w-[9em] object-scale-down rounded-tr-lg rounded-tl-lg" />
                        </div>
                        <div className={`card-body p-2 sm:px-4 items-start h-full flex flex-col`}>
                            <div className={`w-full h-full text-center text-sm font-semibold`}>
                                {product.category}
                            </div>
                        </div>
                    </motion.div>
                </Reveal>
            </Link>
        </>
    );
};
export default CategoryItem;