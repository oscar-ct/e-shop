import {Link} from "react-router-dom";

const Paginate = ({pages, page, isAdmin = false, searchTerm = "", sortByTerm = "", isHomePage = false, filterTerm}) => {
    return (
       pages > 1 && (
               [...Array(pages).keys()].map(function (pg, index) {
                    return (
                        // <Link className={`join-item btn ${pg + 1 === page && "bg-neutral text-base-100 hover:text-neutral"}`} key={index} to={!isAdmin ? searchTerm ? `/search/${searchTerm}/page/${pg+1}` : `/page/${pg + 1}` : `/admin/products/page/${pg + 1}`}>
                        //    {pg + 1}
                        // </Link>
                       <Link preventScrollReset={isHomePage} className={`join-item btn ${pg + 1 === page && "bg-neutral text-white sm:hover:bg-neutral/80 active:bg-neutral/80 focus:bg-neutral sm:hover:text-white focus:text-white active:text-white "}`} key={index} to={!isAdmin && searchTerm && !sortByTerm? `/search/${searchTerm}/page/${pg+1}` : !isAdmin && !searchTerm && !sortByTerm ? `/page/${pg + 1}` : isAdmin && !searchTerm && !sortByTerm ? `/admin/products/page/${pg + 1}` : `/sort/${sortByTerm}/${filterTerm}/page/${pg+1}`}>
                           {pg + 1}
                       </Link>
                    )
                })
       )
    );
};

export default Paginate;