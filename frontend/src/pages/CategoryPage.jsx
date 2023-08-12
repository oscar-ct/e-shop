import React from 'react';
import {Link, useParams} from "react-router-dom";
import {useGetProductsQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Meta from "../components/Meta";
import ProductItem from "../components/ProductItem";
import Paginate from "../components/Paginate";
import {ReactComponent as Arrow} from "../icons/arrow_back.svg";

const CategoryPage = () => {

    const {sortByTerm, pageNumber} = useParams();
    const { data, isLoading} = useGetProductsQuery({sortByTerm, pageNumber});

    return (
        isLoading ? (
            <Spinner/>
        ) : (
            <>
                <Meta title={`Category - ${sortByTerm}`}/>
                {
                    data.products.length !== 0 && (
                        <div className={"mb-10"}>
                            <Link className={"px-2 md:px-0 my-5 flex items-center w-min"} to={"/"}>
                                <Arrow className={"w-5 h-5"}/>
                                <span className={"pl-1 lg:text-sm font-normal"}>
                                    BACK
                                </span>
                            </Link>
                            <h2 className={"text-3xl text-center px-2 pb-5"}>
                                {
                                    data.keyword === "latest" ? "Latest Products" : "Top Rated Products"
                                }
                            </h2>
                            <div className={"w-full flex flex-wrap justify-center"}>
                                {
                                    data.products.map(function (product) {
                                        return <ProductItem key={product._id} product={product}/>
                                    })
                                }
                            </div>
                            <div className={"pt-10 flex justify-center"}>
                                <div className={"join"}>
                                    <Paginate pages={data.pages} page={data.page} sortByTerm={sortByTerm}/>
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