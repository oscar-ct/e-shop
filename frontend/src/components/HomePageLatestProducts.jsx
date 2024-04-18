import ProductItem from "./ProductItem";
import Paginate from "./Paginate";
import {useEffect, useState} from "react";

const HomePageLatestProducts = ({data, windowInnerWidth, scrollTo}) => {
    const [gradient, setGradient] = useState("");
    useEffect(() => windowInnerWidth <= 768 ? setGradient("liner-gradient") : setGradient(""), [windowInnerWidth])
    return (
        <>
            <div className={`pb-1 md:px-3 md:pb-10 pt-14 md:pt-0 bg-black/90 ${gradient} md:bg-transparent`}>
                <div ref={scrollTo} className={"h-12 md:bg-zinc-700"}>
                    <div className={"flex justify-center items-center h-full w-full"}>
                        <h2 className={"lg:pl-3 text-3xl md:text-2xl text-white ibmplex"}>
                            Latest Products
                        </h2>
                    </div>
                </div>
                <div className={"md:bg-white pt-10 md:border-[1px] md:py-8 w-full flex flex-wrap justify-center"}>
                    {
                        data.products.map(function (product) {
                            return <ProductItem key={product._id} product={product} windowInnerWidth={windowInnerWidth}/>
                        })
                    }
                </div>
                {
                    windowInnerWidth >= 768 && (
                        <div className={"pt-10 flex justify-center"}>
                            <div className={"join"}>
                                <Paginate pages={data.pages} page={data.page} isHomePage={true}/>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default HomePageLatestProducts;