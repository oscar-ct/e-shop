import ProductItem from "./ProductItem";
import Paginate from "./Paginate";

const HomePageLatestProducts = ({data, windowInnerWidth, scrollTo}) => {
    return (
        <>
            <div className={"pb-1 md:pb-10 pt-14 md:pt-0 bg-black/90 liner-gradient md:bg-transparent"}>
                <div ref={scrollTo} className={"h-12 md:bg-zinc-700"}>
                    <div className={"flex justify-center items-center h-full w-full"}>
                        <h2 className={"lg:pl-3 text-3xl md:text-2xl text-white ibmplex"}>
                            Latest Products
                        </h2>
                    </div>
                </div>
            {/*</div>*/}
            {/*<div ref={scrollTo} className={"pt-20 pb-3 flex justify-center lg:justify-start items-center w-full"}>*/}
            {/*    <h2 className={"text-3xl md:text-2xl font-bold text-neutral"}>*/}
            {/*        Lastest Products*/}
            {/*    </h2>*/}
            {/*</div>*/}
            {/*<div className={"bg-black/90 liner-gradient md:bg-white"}>*/}
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

                {/*<div className={"pb-10"}>*/}
                {/*    <div className={"pb-10 flex justify-end items-center rounded-xl"}>*/}
                {/*        <Link to={"/sort/latest/select/all"} className={"text-2xl font-bold roboto text-neutral link"}>*/}
                {/*            View All Products*/}
                {/*        </Link>*/}
                {/*    </div>*/}
                {/*    <div className={"h-10 bg-black border-b-[1px] border-grey-300"}/>*/}
                {/*</div>*/}
            </div>

        </>
    );
};

export default HomePageLatestProducts;