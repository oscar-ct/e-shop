import {Link, useLocation} from "react-router-dom";

const AdminTabs = () => {

    const location = useLocation();

    return (
        <>
            <ul className="text-sm font-medium text-center text-gray-500 rounded-lg flex flex-wrap dark:divide-gray-700 dark:text-gray-400">
                <li className="w-6/12 sm:w-3/12 focus-within:z-10">
                    <Link to={"/admin/orders"}
                       className={`${location.pathname === "/admin/orders" ? "text-gray-900 bg-secondary text-white dark:bg-gray-700" : "bg-white dark:bg-gray-800"} inline-block w-full p-4  border-r border-b border-gray-200 dark:border-gray-700 sm:rounded-s-lg hover:text-gray-700 hover:bg-secondary/10 focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:hover:text-white  dark:hover:bg-gray-700
                       `}>
                        Orders
                    </Link>
                </li>
                <li className="w-6/12 sm:w-3/12 focus-within:z-10">
                    <Link to={"/admin/users"}
                       className={`${location.pathname === "/admin/users" ? "text-gray-900 bg-secondary text-white dark:bg-gray-700" : "bg-white dark:bg-gray-800"} inline-block w-full p-4 border-r border-b border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-secondary/10 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white`}>
                        Users
                    </Link>
                </li>
                <li className="w-6/12 sm:w-3/12 focus-within:z-10">
                    <Link to={"/admin/products"}
                       className={`${location.pathname === "/admin/products/sort/latest/select/all" ? "text-gray-900 bg-secondary text-white dark:bg-gray-700" : "bg-white dark:bg-gray-800"} inline-block w-full p-4 border-r sm:border-b border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-secondary/10 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white`}>
                        Products
                    </Link>
                </li>
                <li className="w-6/12 sm:w-3/12 focus-within:z-10">
                    <Link to={"/admin/products/create"}
                       className={`${location.pathname === "/admin/products/create" ? "text-gray-900 bg-secondary text-white dark:bg-gray-700" : "bg-white dark:bg-gray-800"} inline-block w-full p-4 border-s-0 sm:border-b border-gray-200 dark:border-gray-700 sm:rounded-e-lg hover:text-gray-700 hover:bg-secondary/10 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white`}>+ Add New Listing</Link>
                </li>
            </ul>
        </>
    );
};

export default AdminTabs;
