import {useParams} from "react-router-dom";
import {useGetProductsQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Meta from "../components/Meta";
import ProductItem from "../components/ProductItem";
import Paginate from "../components/Paginate";
import SelectMenuSort from "../components/SelectMenuSort";
import SelectMenuCategory from "../components/SelectMenuCategory";
import {useEffect, useState} from "react";
import BackButton from "../components/BackButton";
import {customStyles} from "../utils/selectCustomStyles";

const CategoryPage = () => {

    const {sortByTerm, pageNumber, filterTerm} = useParams();
    const { data, isLoading} = useGetProductsQuery({sortByTerm, pageNumber, filterTerm});
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
    useEffect( () => {
        const adjustWidth = () => {
            setWindowInnerWidth(window.innerWidth);
        }
        window.addEventListener("resize", adjustWidth);
        return () => window.removeEventListener("resize", adjustWidth);
    });

    return (
        isLoading ? (
            <Spinner/>
        ) : (
            <>
                <Meta title={`Category - ${sortByTerm}`}/>
                {
                    data.products.length !== 0 && (
                        <div className={"pb-10"}>
                            <BackButton/>
                            <div className={"pt-14 lg:pt-0"}>
                                <div className={"flex justify-between"}>
                                    <div className={"w-full p-1 flex items-center"}>
                                        <div className={"flex w-full"}>
                                            <div className={"flex flex-col justify-between items-center w-6/12"}>
                                                <p className={"p-1 pr-2 text-sm"}>Category</p>
                                                <div className={"px-2 w-full lg:w-96"}>
                                                    <SelectMenuCategory sortByTerm={sortByTerm} filterTerm={filterTerm} customStyles={customStyles}/>
                                                </div>
                                            </div>
                                            <div className={"flex flex-col justify-between items-center w-6/12"}>
                                                <p className={"p-1 pr-2 text-sm"}>Sort By</p>
                                                <div className={"px-2 w-full lg:w-96"}>
                                                    <SelectMenuSort sortByTerm={sortByTerm} filterTerm={filterTerm} customStyles={customStyles}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*<div className={"flex justify-center items-end"}>*/}
                            {/*    <h2 className={"text-xl lg:text-2xl text-center px-2 pb-5"}>*/}
                            {/*        {data.categoryTerm.substring(0, 1).toUpperCase() + data.categoryTerm.substring(1, data.categoryTerm.length)},*/}
                            {/*    </h2>*/}
                            {/*    <h2 className={"text-xl lg:text-2xl text-center px-2 pb-5"}>*/}
                            {/*        {*/}
                            {/*            data.keyword === "latest" ? "Most Recent" : data.keyword === "toprated" ? "Top Rated" : data.keyword === "price-asc" ? "Price: Low To High" : "Price: High To Low"*/}
                            {/*        }*/}
                            {/*    </h2>*/}
                            {/*</div>*/}
                            <div className={"w-full flex flex-wrap justify-center pt-3"}>
                                {
                                    data.products.map(function (product) {
                                        return <ProductItem key={product._id} product={product} windowInnerWidth={windowInnerWidth}/>
                                    })
                                }
                            </div>
                            <div className={"pt-10 flex justify-center"}>
                                <div className={"join"}>
                                    <Paginate pages={data.pages} page={data.page} sortByTerm={sortByTerm} filterTerm={filterTerm}/>
                                </div>
                            </div>
                        </div>
                    )

                }
            </>
        )
    );
};

export default CategoryPage;