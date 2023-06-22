import React, {useEffect, useState} from 'react';
import Product from "../components/Product";
import axios from "axios";


const HomePage = () => {

    const [products, setProducts] = useState([]);
    useEffect(function () {
        const fetchProducts = async () => {
            const { data } = await axios.get('/api/products');
            setProducts(data);

        }
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <h1 className={"text-center pt-3 text-3xl lg:text-2xl lg:pt-1 font-bold"}>Latest Products</h1>
            <div className={"m-auto w-full flex flex-wrap justify-center"}>
            {
                products.map(function (product) {
                    return <Product key={product._id} product={product}/>
                })
            }
            </div>
        </>
    );
};

export default HomePage;