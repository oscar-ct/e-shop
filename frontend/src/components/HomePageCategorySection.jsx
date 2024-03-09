import CategoryItem from "./CategoryItem";
import {FaChevronDown} from "react-icons/fa";
import {useState} from "react";

const HomePageCategorySection = ({productCategories, windowInnerWidth}) => {

    const [categoryDropdownActive, setCategoryDropdownActive] = useState(false);

    const rotateChevron = (action) => {
        return action ? "open" : "closed";
    };

    return (
        <>
            <div className={"md:pt-20 pt-14 bg-black/90 md:bg-white liner-gradient w-full"}>
                <div className={"h-12 md:bg-neutral border-none md:border-b-[1px] md:border-grey-300"}>
                    <div  className={"flex justify-center lg:justify-start items-center h-full w-full"}>
                        <h2 className={"lg:pl-3 text-3xl md:text-2xl text-white ibmplex"}>
                            Categories
                        </h2>
                    </div>
                </div>

                <div className={"w-full flex flex-wrap justify-center md:border py-10"}>
                    {
                        productCategories.slice(0, !categoryDropdownActive && windowInnerWidth < 768 ? 6 : !categoryDropdownActive && windowInnerWidth < 1024 && windowInnerWidth >= 768 ? 4 : !categoryDropdownActive && windowInnerWidth > 1024 && windowInnerWidth < 1280 ? 5 : !categoryDropdownActive && windowInnerWidth >= 1280 && windowInnerWidth < 1282 ? 6 :
                            !categoryDropdownActive && windowInnerWidth >= 1282 && windowInnerWidth < 1536 ? 7 :
                                !categoryDropdownActive && windowInnerWidth > 1536 ? 8 : 8).map(function (product, index) {
                            return <CategoryItem key={index} product={product} windowInnerWidth={windowInnerWidth}/>
                        })
                    }
                </div>
                <div className={"lg:pt-5"}>
                    <div className={"pb-10 lg:pb-0 flex justify-end items-center px-2"}>
                        <div>
                            {/*<Link to={"/sort/latest/select/all"} className={"btn glass bg-neutral/70 text-white"}>*/}
                            {/*    View All Categories*/}
                            {/*</Link>*/}
                            <button onClick={() => setCategoryDropdownActive(!categoryDropdownActive)} className={"flex items-center text-lg text-white md:text-black"}>
                                {categoryDropdownActive ? "Less Categories" : "More Categories"}
                                <div className={`px-2 ${rotateChevron(categoryDropdownActive)}`}>
                                    <FaChevronDown/>
                                </div>
                            </button>
                        </div>
                    </div>
                    {/*<div className={"h-10 footer bg-neutral border-b-[1px] border-grey-300"}>*/}
                    {/*<img onMouseOver={() => !charizardActive && setCharizardActive(true)} onClick={() => window.location.href = "https://oscar-ct.github.io/pok-mon/"} className={`w-14 ${!charizardActive && "opacity-50"}`} style={{position: "absolute", left: charizardPostion+"%", cursor: "pointer"}} src={charizard} alt={"charizard"}/>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    );
};

export default HomePageCategorySection;