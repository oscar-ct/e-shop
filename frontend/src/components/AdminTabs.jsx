import React from 'react';
import {Link, useLocation} from "react-router-dom";

const AdminTabs = () => {

    const location = useLocation();

    return (
        <div className={"p-5 flex justify-center"}>
            <div className="tabs tabs-boxed bg-neutral">
                <Link
                    to={"/admin/orders"}
                    className={`tab ${location.pathname === "/admin/orders" ? "bg-info text-neutral" : "text-neutral-content"}`}>
                    Orders
                </Link>
                <Link
                    to={"/admin/users"}
                    className={`tab ${location.pathname === "/admin/users" ? "bg-info text-neutral" : "text-neutral-content"}`}>
                    Users
                </Link>
                <Link
                    to={"/admin/products"}
                    className={`tab ${location.pathname === "/admin/products" ? "bg-info text-neutral" : "text-neutral-content"}`}>
                    Products
                </Link>
            </div>
        </div>
    );
};

export default AdminTabs;