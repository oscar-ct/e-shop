import {Link, useLocation} from "react-router-dom";

const AdminTabs = () => {

    const location = useLocation();

    return (
        <>
            <ul className="text-sm font-medium text-center text-gray-500 rounded-lg flex flex-wrap dark:divide-gray-700 dark:text-gray-400">
                <li className="w-6/12 sm:w-3/12 focus-within:z-10">
                    <Link to={"/admin/orders"}
                       className={`${location.pathname === "/admin/orders" ? "text-white bg-gray-700" : "text-gray-200 bg-gray-800"} inline-block w-full p-4 border-r border-b border-gray-700 sm:rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none hover:text-white hover:bg-gray-700
                       `}>
                        Orders
                    </Link>
                </li>
                <li className="w-6/12 sm:w-3/12 focus-within:z-10">
                    <Link to={"/admin/users"}
                       className={`${location.pathname === "/admin/users" ? "text-white bg-gray-700" : "text-gray-200 bg-gray-800"} inline-block w-full p-4 border-r border-b border-gray-700 focus:ring-4 focus:ring-blue-300 focus:outline-none hover:text-white hover:bg-gray-700`}>
                        Users
                    </Link>
                </li>
                <li className="w-6/12 sm:w-3/12 focus-within:z-10">
                    <Link to={"/admin/products"}
                       className={`${location.pathname === "/admin/products" ? "text-white bg-gray-700" : "text-gray-200 bg-gray-800"} inline-block w-full p-4 border-r sm:border-b border-gray-700 focus:ring-4 focus:ring-blue-300 focus:outline-none hover:text-white hover:bg-gray-700`}>
                        Products
                    </Link>
                </li>
                <li className="w-6/12 sm:w-3/12 focus-within:z-10">
                    <Link to={"/admin/products/create"}
                       className={`${location.pathname === "/admin/products/create" ? "text-white bg-gray-700" : "text-gray-200 bg-gray-800"} inline-block w-full p-4 border-s-0 sm:border-b border-gray-700 sm:rounded-e-lg focus:ring-4 focus:outline-none focus:ring-blue-300 hover:text-white hover:bg-gray-700`}>+ Add New Listing</Link>
                </li>
            </ul>
        </>
    );
};

export default AdminTabs;
