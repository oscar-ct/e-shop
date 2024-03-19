import {Link, useLocation} from "react-router-dom";

const AdminTabs = () => {

    const location = useLocation();

    return (
        <>
            <ul className="text-sm font-medium text-center text-gray-500 rounded-lg sm:shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                <li className="w-full focus-within:z-10">
                    <Link to={"/admin/orders"}
                       className={`${location.pathname === "/admin/orders" ? "text-gray-900 bg-gray-100" : "bg-white"} inline-block w-full p-4  border-r border-gray-200 dark:border-gray-700 sm:rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                       aria-current="page`}>
                        Orders
                    </Link>
                </li>
                <li className="w-full focus-within:z-10">
                    <Link to={"/admin/users"}
                       className={`${location.pathname === "/admin/users" ? "text-gray-900 bg-gray-100" : "bg-white"} inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}>
                        Users
                    </Link>
                </li>
                <li className="w-full focus-within:z-10">
                    <Link to={"/admin/products/sort/latest/select/all"}
                       className={`${location.pathname === "/admin/products/sort/latest/select/all" ? "text-gray-900 bg-gray-100" : "bg-white"} inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}>
                        Products
                    </Link>
                </li>
                <li className="w-full focus-within:z-10">
                    <Link to={"/admin/products/create"}
                       className={`${location.pathname === "/admin/products/create" ? "text-gray-900 bg-gray-100" : "bg-white"} inline-block w-full p-4 border-s-0 border-gray-200 dark:border-gray-700 sm:rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}>+ Add New Listing</Link>
                </li>
            </ul>
        </>
    );
};

export default AdminTabs;
