import React, {useEffect, useState} from 'react';
import Spinner from "../components/Spinner";
import {FaTimes, FaEdit} from "react-icons/fa";
import {Link} from "react-router-dom";
import {useGetProductsQuery} from "../slices/productsApiSlice";

const AdminProductListPage = () => {


    const { data: products, isLoading, error } = useGetProductsQuery();

    const [localData, setLocalData] = useState(null);

    useEffect(function () {
        if (products) {
            if (!localData) {
                setLocalData(products);
            }
        }
    }, [products, localData]);


    return (
        isLoading ? <Spinner/> : error ? error : (
            <div className={"pt-10"}>

                <div className={"card bg-base-100 shadow-xl"}>
                    <h3 className={"text-2xl font-bold text-center pt-5"}>Products</h3>
                    <div className="overflow-x-auto p-5">
                        <table className="table table-xs">
                            <thead>
                            <tr>
                                <th/>
                                <th>Product #</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Total (USD)</th>
                                <th>In Stock</th>
                                <th>Post date</th>
                                <th>Category</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                localData && (
                                    localData.map(function(item, index) {
                                        return (
                                            <tr className={"hover"} key={index}>
                                                <th>{index+1}</th>
                                                <td className={"break-all md:break-keep"}>{item._id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.brand}</td>
                                                <td>{item.model}</td>
                                                <td>${item.price}</td>
                                                <td>{item.countInStock !== 0 ? item.countInStock : <FaTimes fill={"red"}/>}</td>
                                                <td>{item.createdAt.substring(0, 10)}</td>
                                                <td>{item.category}</td>
                                                <td>
                                                    <Link className={"btn btn-xs rounded-full normal-case"} to={`/order/${item._id}`}>
                                                        <FaEdit/>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )

                            }
                            </tbody>
                            <tfoot>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        )
    );
};

export default AdminProductListPage;