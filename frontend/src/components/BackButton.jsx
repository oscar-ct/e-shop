import React from 'react';
import {ReactComponent as Arrow} from "../icons/arrow_back.svg";
import {Link} from "react-router-dom";

const BackButton = () => {
    return (
        <Link className={"px-5 md:px-0 my-5 flex items-center w-min"} to={-1}>
            <Arrow className={"w-5 h-5"}/>
            <span className={"pl-1 lg:text-sm font-normal"}>
                BACK
            </span>
        </Link>
    );
};

export default BackButton;