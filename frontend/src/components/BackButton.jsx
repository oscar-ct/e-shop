import {ReactComponent as Arrow} from "../icons/arrow_back.svg";
import {Link} from "react-router-dom";

const BackButton = () => {
    return (
        <div className={"fixed lg:relative z-10 lg:z-0 pt-3 pl-3"}>
            <Link className={"p-3 bg-black/50 rounded-full flex items-center w-min"} to={-1}>
                <Arrow fill={"white"} className={"w-6 h-6"}/>
            </Link>
        </div>
    );
};

export default BackButton;