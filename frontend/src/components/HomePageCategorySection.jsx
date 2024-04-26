import CategoryItem from "./CategoryItem";

const HomePageCategorySection = ({productCategories, windowInnerWidth}) => {

    // const [categoryDropdownActive, setCategoryDropdownActive] = useState(false);
    //
    // const rotateChevron = (action) => {
    //     return action ? "open" : "closed";
    // };

    return (
        <>
            <div className={"pb-10 pt-14 md:pt-0 px-3 md:bg-transparent bg-white w-full"}>
                <div className={"h-12 md:bg-zinc-700 border-none md:border-b-[1px] md:border-grey-300"}>
                    <div  className={"flex justify-center items-center h-full w-full"}>
                        <h2 className={"lg:pl-3 text-3xl md:text-2xl md:text-white ibmplex"}>
                            Popular Categories
                        </h2>
                    </div>
                </div>

                <div className={"bg-white w-full flex flex-wrap justify-center md:border py-6"}>
                    {
                        productCategories.map(function (product, index) {
                            return <CategoryItem key={index} product={product} windowInnerWidth={windowInnerWidth}/>
                        })
                    }
                </div>
                {/*<div className={"md:pt-3"}>*/}
                {/*    <div className={"flex justify-end items-center px-2"}>*/}
                {/*        <div>*/}
                {/*            /!*<Link to={"/sort/latest/select/all"} className={"btn glass bg-neutral/70 text-white"}>*!/*/}
                {/*            /!*    View All Categories*!/*/}
                {/*            /!*</Link>*!/*/}
                {/*            <button onClick={() => setCategoryDropdownActive(!categoryDropdownActive)} className={"flex items-center text-black hover:text-black/70"}>*/}
                {/*                {categoryDropdownActive ? "Less Categories" : "More Categories"}*/}
                {/*                <div className={`px-2 ${rotateChevron(categoryDropdownActive)}`}>*/}
                {/*                    <FaChevronDown/>*/}
                {/*                </div>*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                    {/*<div className={"h-10 footer bg-neutral border-b-[1px] border-grey-300"}>*/}
                    {/*<img onMouseOver={() => !charizardActive && setCharizardActive(true)} onClick={() => window.location.href = "https://oscar-ct.github.io/pok-mon/"} className={`w-14 ${!charizardActive && "opacity-50"}`} style={{position: "absolute", left: charizardPostion+"%", cursor: "pointer"}} src={charizard} alt={"charizard"}/>*/}
                    {/*</div>*/}
            {/*    </div>*/}
            </div>
        </>
    );
};

export default HomePageCategorySection;