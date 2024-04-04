import {FaStar, FaStarHalfAlt, FaRegStar} from 'react-icons/fa'

const Rating = ( {rating, text = ""} ) => {
    return (
        <div className={"flex items-center gap-1"}>
            <span className={"text-yellow-400"}>
                {rating >= 1 ? <FaStar/> : rating >= 0.5 ? <FaStarHalfAlt/> : <FaRegStar/>}
            </span>
            <span className={"text-yellow-400"}>
                {rating >= 2 ? <FaStar/> : rating >= 1.5 ? <FaStarHalfAlt/> : <FaRegStar/>}
            </span>
            <span className={"text-yellow-400"}>
                {rating >= 3 ? <FaStar/> : rating >= 2.5 ? <FaStarHalfAlt/> : <FaRegStar/>}
            </span>
            <span className={"text-yellow-400"}>
                {rating >= 4 ? <FaStar/> : rating >= 3.5 ? <FaStarHalfAlt/> : <FaRegStar/>}
            </span>
            <span className={"text-yellow-400"}>
                {rating >= 5 ? <FaStar/> : rating >= 4.5 ? <FaStarHalfAlt/> : <FaRegStar/>}
            </span>
            <span className={"pl-1"}>
                {text}
            </span>
        </div>
    );
};

export default Rating;