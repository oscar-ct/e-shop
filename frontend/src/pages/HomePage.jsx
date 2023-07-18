// import React, {useEffect, useState} from 'react';
import Product from "../components/Product";
// import axios from "axios";
import {useGetProductsQuery} from "../slices/productsApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {useParams} from "react-router-dom";
import Paginate from "../components/Paginate";

const HomePage = () => {

    const {pageNumber} = useParams();
    const { data, isLoading, error } = useGetProductsQuery({pageNumber});

    // const [products, setProducts] = useState([]);
    // useEffect(function () {
    //     const fetchProducts = async () => {
    //         const { data } = await axios.get('/api/products');
    //         setProducts(data);
    //
    //     }
    //     fetchProducts();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);


    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <Message variant={"error"} children={error?.data?.message || error.error}/>
                ) : (
                    <>
                        {/*<div>*/}
                        {/*    <div className={"bg-base-100 h-96"}>*/}

                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className={"my-3"}>
                            <h2 className={"text-2xl mt-3"}>Recently Added</h2>
                            <div className={"w-full flex flex-wrap justify-center"}>
                                {
                                    data.products.map(function (product) {
                                        return <Product key={product._id} product={product}/>
                                    })
                                }
                            </div>
                        </div>
                        <div className={"pt-10 flex justify-center"}>
                            <div className={"join"}>
                                <Paginate pages={data.pages} page={data.page}/>
                            </div>
                        </div>

                    </>
                )
            }

        </>
    );
};

export default HomePage;