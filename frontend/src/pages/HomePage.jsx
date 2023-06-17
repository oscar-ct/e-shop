import React from 'react';
import products from "../products";
import Product from "../components/Product";


const HomePage = () => {
    return (
        <>
            <h1 className={"text-center pt-3 text-3xl lg:text-2xl  lg:pt-1 font-bold"}>Latest Products</h1>
            <div className={"m-auto w-full flex flex-wrap justify-center"}>
            {
                products.map(function (product) {
                    return <Product product={product}/>
                })
            }
            </div>
        </>
    );
};

export default HomePage;