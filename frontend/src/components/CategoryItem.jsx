import {Link} from 'react-router-dom'
import {motion} from "framer-motion";

const CategoryItem = ({product, windowInnerWidth}) => {
    return (
        <>
            <Link to={`/sort/latest/${product.category.toLowerCase()}`} className={"w-6/12 sm:w-[175px] p-1 sm:py-3 sm:px-2"}>
                <motion.div initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            whileHover={windowInnerWidth > 640 ? { scale: 1.1} : {scale: "none"}}
                            whileTap={windowInnerWidth > 640 ? { scale: 0.9} : {scale: "none"}}
                            className={`rounded-xl flex flex-col items-center bg-white shadow-xl h-full w-full`}
                >
                    <div className="p-2 flex justify-center">
                        <img src={product.images[product.images.length > 1 ? 1 : 0].url} alt="product" className="bg-zinc-100/20 h-[9em] w-[9em] object-scale-down rounded-tr-xl rounded-tl-xl " />
                    </div>
                    <div className={`card-body p-2 sm:px-4 items-start h-full flex flex-col`}>
                        <div className={`w-full h-full text-center text-sm font-semibold`}>
                            {product.category}
                        </div>
                    </div>
                </motion.div>
            </Link>
        </>
    );
};
export default CategoryItem;