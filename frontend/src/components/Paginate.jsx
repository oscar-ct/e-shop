import {Link} from "react-router-dom";
import React from 'react';

const Paginate = ({pages, page, isAdmin = false}) => {

    return (
       pages > 1 && (
               [...Array(pages).keys()].map(function (pg, index) {
                    return (
                        <Link className={`join-item btn ${pg + 1 === page && "bg-primary text-base-100 hover:text-neutral"}`} key={index} to={!isAdmin ? `/page/${pg + 1}` : `/admin/products/page/${pg + 1}`}>
                           {pg + 1}
                        </Link>
                    )
                })
       )
    );
};

export default Paginate;