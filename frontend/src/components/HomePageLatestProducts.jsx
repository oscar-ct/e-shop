import ProductItem from "./ProductItem";
import Paginate from "./Paginate";

const HomePageLatestProducts = ({data, windowInnerWidth, scrollTo}) => {
    return (
        <>
            <div className={"pt-14 pb-10 md:pb-0"}>
                <div ref={scrollTo} className={"h-12 md:bg-neutral"}>
                    <div className={"flex justify-center lg:justify-start items-center h-full w-full"}>
                        <h2 className={"lg:pl-3 text-3xl md:text-2xl font-semibold md:text-white ibmplex"}>
                            Lastest Products
                        </h2>
                    </div>
                </div>
            </div>
            {/*<div ref={scrollTo} className={"pt-20 pb-3 flex justify-center lg:justify-start items-center w-full"}>*/}
            {/*    <h2 className={"text-3xl md:text-2xl font-bold text-neutral"}>*/}
            {/*        Lastest Products*/}
            {/*    </h2>*/}
            {/*</div>*/}
            <div className={"pb-10 "}>
                <div className={"border-[1px] py-8 w-full flex flex-wrap justify-center"}>
                    {
                        data.products.map(function (product) {
                            return <ProductItem key={product._id} product={product} windowInnerWidth={windowInnerWidth}/>
                        })
                    }
                </div>
                <div className={"pt-10 flex justify-center"}>
                    <div className={"join"}>
                        <Paginate pages={data.pages} page={data.page} isHomePage={true}/>
                    </div>
                </div>
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